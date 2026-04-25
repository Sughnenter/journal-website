import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { submissionsAPI, categoriesAPI } from '../services/api';

// ── helper maps ──────────────────────────────────────────────────────────────
const STATUS_COLOR = {
  pending:            'bg-yellow-100 text-yellow-800',
  under_review:       'bg-blue-100 text-blue-800',
  revision_requested: 'bg-orange-100 text-orange-800',
  accepted:           'bg-green-100 text-green-800',
  rejected:           'bg-red-100 text-red-800',
  withdrawn:          'bg-gray-100 text-gray-800',
};

const STATUS_LABEL = {
  pending:            'Pending Review',
  under_review:       'Under Review',
  revision_requested: 'Revision Requested',
  accepted:           'Accepted',
  rejected:           'Rejected',
  withdrawn:          'Withdrawn',
};

// statuses where the author can still act
const CAN_WITHDRAW = ['pending', 'under_review', 'revision_requested'];
const CAN_EDIT_RESUBMIT = ['rejected', 'revision_requested', 'withdrawn'];

// ── Submission Detail / Edit Modal ────────────────────────────────────────────
function SubmissionModal({ submission, categories, onClose, onWithdraw, onResubmit }) {
  const [mode, setMode] = useState('view');          // 'view' | 'edit'
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  // edit form mirrors the submission fields
  const [form, setForm] = useState({
    title:      submission.title,
    abstract:   submission.abstract,
    keywords:   submission.keywords,
    category:   submission.category,
    co_authors: submission.co_authors || '',
    manuscript: null,
    coverLetter: null,
  });

  const change = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const fileChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.files[0] || null }));

  const handleResubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr('');
    try {
      const payload = new FormData();
      payload.append('title',      form.title);
      payload.append('abstract',   form.abstract);
      payload.append('keywords',   form.keywords);
      payload.append('category',   form.category);
      payload.append('co_authors', form.co_authors);
      if (form.manuscript)   payload.append('manuscript_file', form.manuscript);
      if (form.coverLetter)  payload.append('cover_letter',    form.coverLetter);
      await onResubmit(submission.id, payload);
      onClose();
    } catch (e) {
      setErr(e.message || 'Resubmission failed.');
    } finally {
      setSaving(false);
    }
  };

  const canWithdraw      = CAN_WITHDRAW.includes(submission.status);
  const canEditResubmit  = CAN_EDIT_RESUBMIT.includes(submission.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b">
          <div className="pr-4">
            <h2 className="text-lg font-bold text-gray-900 leading-tight">{submission.title}</h2>
            <span className={`inline-block mt-2 px-2 py-0.5 text-xs font-semibold rounded-full ${STATUS_COLOR[submission.status]}`}>
              {STATUS_LABEL[submission.status]}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* Tab switch (only when editing is possible) */}
          {canEditResubmit && (
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setMode('view')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium ${mode === 'view' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Details
              </button>
              <button
                onClick={() => setMode('edit')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium ${mode === 'edit' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Edit &amp; Resubmit
              </button>
            </div>
          )}

          {/* ── VIEW MODE ── */}
          {mode === 'view' && (
            <div className="space-y-4 text-sm">
              <Detail label="Category"  value={submission.category_name} />
              <Detail label="Submitted" value={new Date(submission.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} />
              {submission.co_authors && <Detail label="Co-authors" value={submission.co_authors} />}
              <div>
                <p className="font-semibold text-gray-700 mb-1">Abstract</p>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{submission.abstract}</p>
              </div>
              <Detail label="Keywords" value={submission.keywords} />
              {submission.status === 'rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-red-800 mb-1">Your submission was rejected.</p>
                  <p className="text-sm text-red-700">You can edit and resubmit using the "Edit &amp; Resubmit" tab above.</p>
                </div>
              )}
              {submission.status === 'revision_requested' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-orange-800 mb-1">Revision requested.</p>
                  <p className="text-sm text-orange-700">Please update your manuscript and resubmit.</p>
                </div>
              )}
            </div>
          )}

          {/* ── EDIT / RESUBMIT MODE ── */}
          {mode === 'edit' && (
            <form id="resubmit-form" onSubmit={handleResubmit} className="space-y-5">
              {err && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{err}</p>}

              <Field label="Title" required>
                <input
                  name="title" type="text" required value={form.title} onChange={change}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </Field>

              <Field label="Category" required>
                <select name="category" required value={form.category} onChange={change}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                  <option value="">Select a category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>

              <Field label="Abstract" required>
                <textarea
                  name="abstract" required rows={5} value={form.abstract} onChange={change}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
              </Field>

              <Field label="Keywords" required>
                <input
                  name="keywords" type="text" required value={form.keywords} onChange={change}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="comma-separated"
                />
              </Field>

              <Field label="Co-authors (optional)">
                <textarea
                  name="co_authors" rows={2} value={form.co_authors} onChange={change}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
              </Field>

              <Field label="Replace manuscript file (optional)">
                <input name="manuscript" type="file" accept=".pdf,.doc,.docx" onChange={fileChange}
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                {form.manuscript && <p className="mt-1 text-xs text-green-600">✓ {form.manuscript.name}</p>}
              </Field>

              <Field label="Replace cover letter (optional)">
                <input name="coverLetter" type="file" accept=".pdf,.doc,.docx" onChange={fileChange}
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                {form.coverLetter && <p className="mt-1 text-xs text-green-600">✓ {form.coverLetter.name}</p>}
              </Field>
            </form>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t flex flex-wrap items-center justify-between gap-3">
          <div>
            {canWithdraw && (
              <WithdrawButton onWithdraw={() => onWithdraw(submission.id)} onClose={onClose} />
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              Close
            </button>
            {mode === 'edit' && (
              <button type="submit" form="resubmit-form" disabled={saving}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                {saving && (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                )}
                {saving ? 'Resubmitting…' : 'Resubmit'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── tiny helper components ────────────────────────────────────────────────────
function Detail({ label, value }) {
  return (
    <div>
      <span className="font-semibold text-gray-700">{label}: </span>
      <span className="text-gray-600">{value || '—'}</span>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function WithdrawButton({ onWithdraw, onClose }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Withdraw this submission?</span>
        <button
          onClick={async () => {
            setBusy(true);
            await onWithdraw();
            onClose();
          }}
          disabled={busy}
          className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {busy ? 'Withdrawing…' : 'Yes, withdraw'}
        </button>
        <button onClick={() => setConfirming(false)} className="px-3 py-1.5 border border-gray-300 text-sm rounded-lg hover:bg-gray-50">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 font-medium"
    >
      Withdraw
    </button>
  );
}

// ── Main DashboardPage ────────────────────────────────────────────────────────
export function DashboardPage() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [selected, setSelected] = useState(null);   // submission shown in modal
  const [toast,    setToast]    = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [subData, catData] = await Promise.all([
        submissionsAPI.getAll(),
        categoriesAPI.getAll(),
      ]);
      setSubmissions(Array.isArray(subData) ? subData : subData.results || []);
      setCategories(Array.isArray(catData)  ? catData : catData.results  || []);
      setError(null);
    } catch (e) {
      setError(e.message || 'Failed to load submissions');
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleWithdraw = async (id) => {
    await submissionsAPI.withdraw(id);
    setSubmissions(prev =>
      prev.map(s => s.id === id ? { ...s, status: 'withdrawn' } : s)
    );
    showToast('Submission withdrawn successfully.');
  };

  const handleResubmit = async (id, payload) => {
    // Create a brand-new submission with the updated payload
    const newSub = await submissionsAPI.create(payload);
    // Also withdraw the old one so the list stays clean
    try { await submissionsAPI.withdraw(id); } catch (_) {}
    setSubmissions(prev => [
      newSub,
      ...prev.map(s => s.id === id ? { ...s, status: 'withdrawn' } : s),
    ]);
    showToast('Manuscript resubmitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-pulse">
          {toast}
        </div>
      )}

      {/* Submission detail modal */}
      {selected && (
        <SubmissionModal
          submission={selected}
          categories={categories}
          onClose={() => setSelected(null)}
          onWithdraw={handleWithdraw}
          onResubmit={handleResubmit}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, {user?.first_name}!</h1>
          <p className="text-gray-600">Manage your submissions and track your research publications</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { to: '/submit',   icon: 'M12 4v16m8-8H4',                     bg: 'bg-blue-100',   ic: 'text-blue-600',   title: 'Submit Manuscript', sub: 'Submit new research' },
            { to: '/articles', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', bg: 'bg-green-100', ic: 'text-green-600', title: 'Browse Articles', sub: 'Explore publications' },
            { to: '/profile',  icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', bg: 'bg-purple-100', ic: 'text-purple-600', title: 'Profile Settings', sub: 'Update your info' },
          ].map(({ to, icon, bg, ic, title, sub }) => (
            <Link key={to} to={to} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center">
                <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center`}>
                  <svg className={`w-6 h-6 ${ic}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-600">{sub}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Submissions table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Submissions</h2>
            <Link to="/submit" className="text-blue-600 hover:text-blue-700 font-medium">+ New Submission</Link>
          </div>

          {error && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-sm text-yellow-700">
              {error} — make sure the backend is running on port 8000.
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <p className="mt-2 text-gray-600">Loading submissions…</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No submissions yet</h3>
              <p className="mt-2 text-gray-500">Get started by submitting your first manuscript</p>
              <Link to="/submit" className="mt-4 inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                Submit Manuscript
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Title', 'Category', 'Status', 'Submitted', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-sm font-medium text-gray-900 truncate">{s.title}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{s.category_name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 inline-flex text-xs font-semibold rounded-full ${STATUS_COLOR[s.status]}`}>
                          {STATUS_LABEL[s.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(s.submitted_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSelected(s)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View
                          </button>
                          {CAN_EDIT_RESUBMIT.includes(s.status) && (
                            <button
                              onClick={() => { setSelected(s); }}
                              className="text-orange-600 hover:text-orange-800 font-medium"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
