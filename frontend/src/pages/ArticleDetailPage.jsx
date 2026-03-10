import React from 'react'

import { useParams, Link } from 'react-router';
import { getArticleById } from '../data/mockData';

export function ArticleDetailPage() {
  const { id } = useParams();
  const article = getArticleById(id);

  if (!article) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
        <Link to="/articles" className="text-blue-600 hover:text-blue-700">
          Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <ol className="flex items-center space-x-2 text-gray-500">
          <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
          <li>/</li>
          <li><Link to="/articles" className="hover:text-blue-600">Articles</Link></li>
          <li>/</li>
          <li className="text-gray-900">{article.title.substring(0, 30)}...</li>
        </ol>
      </nav>

      {/* Article Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="mb-6">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
            {article.category}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {article.title}
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Authors</h3>
            <ul className="space-y-1">
              {article.authors.map((author, index) => (
                <li key={index} className="text-gray-600">{author}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-sm font-semibold text-gray-700">Published: </span>
              <span className="text-gray-600">{article.month} {article.year}</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-700">Volume: </span>
              <span className="text-gray-600">{article.volume}, Issue {article.issue}</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-700">Pages: </span>
              <span className="text-gray-600">{article.pages}</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-700">DOI: </span>
              <span className="text-gray-600">{article.doi}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <a
            href={article.pdfUrl}
            className="flex-1 md:flex-none px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </a>
          <button className="flex-1 md:flex-none px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
          <button className="flex-1 md:flex-none px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Cite
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
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Keywords</h2>
        <div className="flex flex-wrap gap-3">
          {article.keywords.map((keyword, index) => (
            <span 
              key={index} 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition cursor-pointer"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Article Metrics (Placeholder) */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Article Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">1,234</div>
            <div className="text-sm text-gray-600 mt-2">Views</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">567</div>
            <div className="text-sm text-gray-600 mt-2">Downloads</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">23</div>
            <div className="text-sm text-gray-600 mt-2">Citations</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">4.5</div>
            <div className="text-sm text-gray-600 mt-2">Alt. Score</div>
          </div>
        </div>
      </div>

      {/* Citation Box */}
      <div className="bg-gray-50 rounded-lg p-8 mb-8 border-l-4 border-blue-600">
        <h3 className="text-lg font-bold text-gray-900 mb-3">How to Cite</h3>
        <p className="text-sm text-gray-700 font-mono bg-white p-4 rounded border border-gray-200">
          {article.authors.join(', ')} ({article.year}). {article.title}. <em>Journal of Applied Sciences</em>, {article.volume}({article.issue}), {article.pages}. {article.doi}
        </p>
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


