import React, {useState} from 'react'

export function SubmitPage ()  {
    const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: '',
    category: '',
    firstName: '',
    lastName: '',
    email: '',
    affiliation: '',
    correspondingAuthor: true,
    coAuthors: '',
    manuscript: null,
    coverLetter: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Manuscript submission received! (This is a demo - no actual submission occurred)');
    console.log('Form data:', formData);
  };

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
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Manuscripts must be original work not previously published</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Submit in Microsoft Word (.docx) or PDF format</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Include abstract (250 words max) and 4-6 keywords</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Average review time: 4-6 weeks</span>
          </li>
        </ul>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
        {/* Manuscript Information */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b">Manuscript Information</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Manuscript Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the full title of your manuscript"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Subject Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                <option value="computer-science">Computer Science</option>
                <option value="agriculture">Agriculture</option>
                <option value="environmental">Environmental Science</option>
                <option value="medical">Medical Science</option>
                <option value="engineering">Engineering</option>
                <option value="neuroscience">Neuroscience</option>
              </select>
            </div>

            <div>
              <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 mb-2">
                Abstract <span className="text-red-500">*</span>
              </label>
              <textarea
                id="abstract"
                name="abstract"
                required
                value={formData.abstract}
                onChange={handleInputChange}
                rows={6}
                maxLength={2500}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your abstract (max 250 words)"
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.abstract.length} / 2500 characters
              </p>
            </div>

            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                Keywords <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="keywords"
                name="keywords"
                required
                value={formData.keywords}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter 4-6 keywords separated by commas"
              />
            </div>
          </div>
        </div>

        {/* Author Information */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b">Author Information</h2>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your.email@university.edu"
              />
            </div>

            <div>
              <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700 mb-2">
                Institutional Affiliation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="affiliation"
                name="affiliation"
                required
                value={formData.affiliation}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="University/Institution Name"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="correspondingAuthor"
                name="correspondingAuthor"
                checked={formData.correspondingAuthor}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="correspondingAuthor" className="ml-2 block text-sm text-gray-700">
                I am the corresponding author
              </label>
            </div>

            <div>
              <label htmlFor="coAuthors" className="block text-sm font-medium text-gray-700 mb-2">
                Co-Authors (Optional)
              </label>
              <textarea
                id="coAuthors"
                name="coAuthors"
                value={formData.coAuthors}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List co-authors with their affiliations (one per line)"
              />
            </div>
          </div>
        </div>

        {/* File Uploads */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b">File Uploads</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="manuscript" className="block text-sm font-medium text-gray-700 mb-2">
                Manuscript File <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="manuscript" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input
                        id="manuscript"
                        name="manuscript"
                        type="file"
                        required
                        onChange={handleFileChange}
                        accept=".doc,.docx,.pdf"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">DOC, DOCX, or PDF up to 10MB</p>
                  {formData.manuscript && (
                    <p className="text-sm text-green-600 font-medium">
                      ✓ {formData.manuscript.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="coverLetter" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input
                        id="coverLetter"
                        name="coverLetter"
                        type="file"
                        onChange={handleFileChange}
                        accept=".doc,.docx,.pdf"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">DOC, DOCX, or PDF up to 5MB</p>
                  {formData.coverLetter && (
                    <p className="text-sm text-green-600 font-medium">
                      ✓ {formData.coverLetter.name}
                    </p>
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
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2"
          >
            Submit Manuscript
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </form>

      {/* Contact Info */}
      <div className="mt-8 text-center text-gray-600">
        <p>Questions about submission? Contact us at <a href="mailto:submissions@journal.edu" className="text-blue-600 hover:text-blue-700">submissions@journal.edu</a></p>
      </div>
    </div>
  );
}

