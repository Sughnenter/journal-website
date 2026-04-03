import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { articlesAPI } from '../services/api';

export function ArticleDetailPage() {
  const { id } = useParams(); // 'id' is actually the slug from your route /articles/:id
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cited, setCited] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await articlesAPI.getBySlug(id);
        setArticle(data);
        // Track view — fire and forget, don't block render
        articlesAPI.trackDownload(id).catch(() => {});
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleDownload = async () => {
    if (!article?.published_pdf) return;
    try {
      await articlesAPI.trackDownload(article.slug);
      setArticle(prev => ({ ...prev, downloads_count: prev.downloads_count + 1 }));
    } catch {
      // silently fail — download still works
    }
    window.open(article.published_pdf, '_blank');
  };

  const handleCite = () => {
    const citation = buildCitation(article);
    navigator.clipboard.writeText(citation).then(() => {
      setCited(true);
      setTimeout(() => setCited(false), 2500);
    });
  };

  const buildCitation = (a) => {
    const authorNames = (a.authors || []).map(au => au.author_name).join(', ');
    const year = a.published_date ? new Date(a.published_date).getFullYear() : '';
    const vol = a.volume_number ? `${a.volume_number}` : '';
    const iss = a.issue_number  ? `(${a.issue_number})` : '';
    return `${authorNames} (${year}). ${a.title}. Journal of Biological Sciences, ${vol}${iss}, ${a.pages || ''}. ${a.doi || ''}`;
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-4 bg-gray-200 rounded" />)}
              </div>
              <div className="space-y-3">
                {[1,2,3,4].map(i => <div key={i} className="h-4 bg-gray-200 rounded" />)}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-gray-200 rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  // ── Error / Not found ────────────────────────────────────────────────────
  if (error || !article) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h1>
        <p className="text-gray-500 mb-6">{error || 'This article does not exist or has been removed.'}</p>
        <Link to="/articles" className="text-blue-600 hover:text-blue-700 font-medium">
          ← Back to Articles
        </Link>
      </div>
    );
  }

  // ── Derived values ───────────────────────────────────────────────────────
  const publishedYear = article.published_date
    ? new Date(article.published_date).getFullYear()
    : null;
  const publishedMonth = article.published_date
    ? new Date(article.published_date).toLocaleString('default', { month: 'long' })
    : null;

  const authorNames = (article.authors || []).map(a => a.author_name);
  const keywords    = article.keywords_list || article.keywords?.split(',').map(k => k.trim()) || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <ol className="flex items-center space-x-2 text-gray-500">
          <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
          <li>/</li>
          <li><Link to="/articles" className="hover:text-blue-600">Articles</Link></li>
          <li>/</li>
          <li className="text-gray-900 truncate max-w-xs">{article.title.substring(0, 40)}...</li>
        </ol>
      </nav>

      {/* Article Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="mb-6">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
            {article.category_name}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {article.title}
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
          {/* Authors */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Authors</h3>
            <ul className="space-y-1">
              {(article.authors || []).map((author, index) => (
                <li key={index} className="text-gray-600 flex items-center gap-2">
                  {author.author_name}
                  {author.is_corresponding && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      Corresponding
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {/* Affiliations */}
            {(article.authors || []).some(a => a.author_affiliation) && (
              <ul className="mt-3 space-y-1">
                {(article.authors || [])
                  .filter(a => a.author_affiliation)
                  .map((author, index) => (
                    <li key={index} className="text-xs text-gray-500 italic">
                      {author.author_name}: {author.author_affiliation}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {/* Publication metadata */}
          <div className="space-y-3">
            {(publishedMonth || publishedYear) && (
              <div>
                <span className="text-sm font-semibold text-gray-700">Published: </span>
                <span className="text-gray-600">{publishedMonth} {publishedYear}</span>
              </div>
            )}
            {(article.volume_number || article.issue_number) && (
              <div>
                <span className="text-sm font-semibold text-gray-700">Volume: </span>
                <span className="text-gray-600">
                  {article.volume_number ?? '—'}, Issue {article.issue_number ?? '—'}
                </span>
              </div>
            )}
            {article.pages && (
              <div>
                <span className="text-sm font-semibold text-gray-700">Pages: </span>
                <span className="text-gray-600">{article.pages}</span>
              </div>
            )}
            {article.doi && (
              <div>
                <span className="text-sm font-semibold text-gray-700">DOI: </span>
                <span className="text-gray-600">{article.doi}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          {article.published_pdf ? (
            <button
              onClick={handleDownload}
              className="flex-1 md:flex-none px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
          ) : (
            <button disabled className="flex-1 md:flex-none px-6 py-3 bg-gray-200 text-gray-400 rounded-lg font-medium flex items-center justify-center gap-2 cursor-not-allowed">
              PDF Unavailable
            </button>
          )}

          <button
            onClick={() => navigator.share?.({ title: article.title, url: window.location.href })}
            className="flex-1 md:flex-none px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>

          <button
            onClick={handleCite}
            className="flex-1 md:flex-none px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {cited ? 'Copied!' : 'Cite'}
          </button>
        </div>
      </div>

      {/* Abstract */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Abstract</h2>
        <p className="text-gray-700 leading-relaxed text-lg">
          {article.abstract}
        </p>
      </div>

      {/* Keywords */}
      {keywords.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Keywords</h2>
          <div className="flex flex-wrap gap-3">
            {keywords.map((keyword, index) => (
              <Link
                key={index}
                to={`/articles?search=${encodeURIComponent(keyword)}`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition cursor-pointer text-sm"
              >
                {keyword}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Article Metrics — real data */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Article Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">
              {article.views_count?.toLocaleString() ?? 0}
            </div>
            <div className="text-sm text-gray-600 mt-2">Views</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">
              {article.downloads_count?.toLocaleString() ?? 0}
            </div>
            <div className="text-sm text-gray-600 mt-2">Downloads</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">
              {publishedYear ?? '—'}
            </div>
            <div className="text-sm text-gray-600 mt-2">Year</div>
          </div>
        </div>
      </div>

      {/* Citation Box */}
      <div className="bg-gray-50 rounded-lg p-8 mb-8 border-l-4 border-blue-600">
        <h3 className="text-lg font-bold text-gray-900 mb-3">How to Cite</h3>
        <p className="text-sm text-gray-700 font-mono bg-white p-4 rounded border border-gray-200 leading-relaxed">
          {authorNames.join(', ')} ({publishedYear}). {article.title}.{' '}
          <em>Journal of Biological Sciences</em>,{' '}
          {article.volume_number ?? ''}
          {article.issue_number ? `(${article.issue_number})` : ''},
          {article.pages ? ` ${article.pages}.` : ''}{' '}
          {article.doi}
        </p>
        <button
          onClick={handleCite}
          className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {cited ? '✓ Copied to clipboard' : 'Copy citation'}
        </button>
      </div>

      {/* Back Button */}
      <div className="text-center">
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to All Articles
        </Link>
      </div>
    </div>
  );
}
