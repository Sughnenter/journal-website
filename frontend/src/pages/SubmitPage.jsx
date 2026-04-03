import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { submissionsAPI, categoriesAPI } from '../services/api';

export function SubmitPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: '',
    category: '',
    coAuthors: '',
    manuscript: null,
    coverLetter: null,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Load categories from backend
  useEffect(() => {
    categoriesAPI.getAll()
      .then(data => setCategories(Array.isArray(data) ? data : data.results || []))
      .catch(() => setCategories([]));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] || null }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      // Build FormData for multipart/form-data (required for file uploads)
      const payload = new FormData();
      payload.append('title',         formData.title);
      payload.append('abstract',      formData.abstract);
      payload.append('keywords',      formData.keywords);
      payload.append('category',      formData.category);
      payload.append('co_authors',    formData.coAuthors);
      if (formData.manuscript)  payload.append('manuscript_file', formData.manuscript);
      if (formData.coverLetter) payload.append('cover_letter',    formData.coverLetter);

      await submissionsAPI.create(payload);
      navigate('/dashboard', { state: { submitted: true } });

    } catch (err) {
      // Django REST validation errors come back as { field: ["message"] }
      // Try to parse them into per-field errors
      const raw = err?.response?.data || err?.data;
      if (raw && typeof raw === 'object') {
        const fields = {};
        let hasField = false;
        for (const [key, val] of Object.entries(raw)) {
          if (key !== 'detail' && key !== 'non_field_errors') {
            fields[key] = Array.isArray(val) ? val[0] : val;
            hasField = true;
          }
        }
        if (hasField) {
          setFieldErrors(fields);
          setError('Please fix the errors below and try again.');
        } else {
          setError(err.message || 'Submission failed. Please try again.');
        }
      } else {
        setError(err.message || 'Submission failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (name) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      fieldErrors[name] ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`;

  const FieldError = ({ name }) =>
    fieldErrors[name] ? (
      <p className="mt-1 text-sm text-red-600">{fieldErrors[name]}</p>
    ) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Submit Your Manuscript</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Share your research with our global community. Please complete the form below to submit your manuscript for peer review.
        </p>
      </div>

      {/* Submission Guidelines */}
      <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Submission Guidelines</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          {[
            'Manuscripts must be original work not previously published',
            'Submit in Microsoft Word (.docx) or PDF format',
            'Include abstract (250 words max) and 4-6 keywords',
            'Average review time: 4-6 weeks',
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Global error banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">

        {/* ── Manuscript Information ── */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b">Manuscript Information</h2>
          <div className="space-y-6">

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Manuscript Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text" id="title" name="title" required
                value={formData.title} onChange={handleInputChange}
                className={inputClass('title')}
                placeholder="Enter the full title of your manuscript"
              />
              <FieldError name="title" />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Subject Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category" name="category" required
                value={formData.category} onChange={handleInputChange}
                className={inputClass('category')}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <FieldError name="category" />
            </div>

            <div>
              <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 mb-2">
                Abstract <span className="text-red-500">*</span>
              </label>
              <textarea
                id="abstract" name="abstract" required rows={6} maxLength={2500}
                value={formData.abstract} onChange={handleInputChange}
                className={inputClass('abstract')}
                placeholder="Enter your abstract (max 2500 words)"
              />
              <p className="mt-1 text-sm text-gray-500">{formData.abstract.length} / 2500 characters</p>
              <FieldError name="abstract" />
            </div>

            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                Keywords <span className="text-red-500">*</span>
              </label>
              <input
                type="text" id="keywords" name="keywords" required
                value={formData.keywords} onChange={handleInputChange}
                className={inputClass('keywords')}
                placeholder="Enter 4-6 keywords separated by commas"
              />
              <FieldError name="keywords" />
            </div>
          </div>
        </div>

        {/* ── Co-Authors ── */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b">Co-Authors</h2>
          <div>
            <label htmlFor="coAuthors" className="block text-sm font-medium text-gray-700 mb-2">
              Co-Authors (Optional)
            </label>
            <textarea
              id="coAuthors" name="coAuthors" rows={3}
              value={formData.coAuthors} onChange={handleInputChange}
              className={inputClass('coAuthors')}
              placeholder="List co-authors with their affiliations (one per line, e.g. Dr. Jane Doe, Stanford University)"
            />
            <p className="mt-1 text-sm text-gray-500">
              Your own author info is taken from your account profile.
            </p>
            <FieldError name="co_authors" />
          </div>
        </div>

        {/* ── File Uploads ── */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b">File Uploads</h2>
          <div className="space-y-6">

            {/* Manuscript */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manuscript File <span className="text-red-500">*</span>
              </label>
              <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition ${
                fieldErrors.manuscript_file ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-blue-400'
              }`}>
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="manuscript" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input
                        id="manuscript" name="manuscript" type="file" required
                        onChange={handleFileChange} accept=".doc,.docx,.pdf"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">DOC, DOCX, or PDF up to 10MB</p>
                  {formData.manuscript && (
                    <p className="text-sm text-green-600 font-medium">✓ {formData.manuscript.name}</p>
                  )}
                </div>
              </div>
              <FieldError name="manuscript_file" />
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="coverLetter" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input
                        id="coverLetter" name="coverLetter" type="file"
                        onChange={handleFileChange} accept=".doc,.docx,.pdf"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">DOC, DOCX, or PDF up to 5MB</p>
                  {formData.coverLetter && (
                    <p className="text-sm text-green-600 font-medium">✓ {formData.coverLetter.name}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6 border-t">
          <p className="text-sm text-gray-500">
            <span className="text-red-500">*</span> Required fields
          </p>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                Submit Manuscript
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Contact Info */}
      <div className="mt-8 text-center text-gray-600">
        <p>Questions about submission? Contact us at{' '}
          <a href="mailto:submissions@journal.edu" className="text-blue-600 hover:text-blue-700">
            submissions@journal.edu
          </a>
        </p>
      </div>
    </div>
  );
}
