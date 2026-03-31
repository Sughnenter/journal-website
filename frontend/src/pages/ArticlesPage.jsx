import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { articlesAPI, categoriesAPI } from '../services/api';

export function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch categories once on mount
  useEffect(() => {
    categoriesAPI.getAll()
      .then(data => {
        // Handle both paginated { results: [] } and plain array responses
        setCategories(Array.isArray(data) ? data : data.results || []);
      })
      .catch(() => setCategories([]));
  }, []);

  // Fetch articles whenever search, category, or page changes
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: currentPage };
      if (searchQuery.trim())  params.search   = searchQuery.trim();
      if (selectedCategory)    params.category  = selectedCategory;

      const data = await articlesAPI.getAll(params);

      // Django REST paginated response: { count, results: [] }
      if (data.results !== undefined) {
        setArticles(data.results);
        setTotalCount(data.count);
        setTotalPages(Math.ceil(data.count / 10)); // matches your PAGE_SIZE
      } else {
        // Non-paginated fallback
        setArticles(Array.isArray(data) ? data : []);
        setTotalCount(Array.isArray(data) ? data.length : 0);
      }
    } catch (err) {
      setError(err.message);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, currentPage]);

  useEffect(() => {
    // Debounce search so we don't fire on every keystroke
    const timer = setTimeout(fetchArticles, 300);
    return () => clearTimeout(timer);
  }, [fetchArticles]);

  // Reset to page 1 when filters change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategory = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Published Articles</h1>
        <p className="text-lg text-gray-600">
          Browse our collection of peer-reviewed research articles
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Articles
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="Search by title, author, or keywords..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategory}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          {loading ? 'Loading...' : `Showing ${articles.length} of ${totalCount} article${totalCount !== 1 ? 's' : ''}`}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          ))}
        </div>
      )}

      {/* Articles List */}
      {!loading && (
        <div className="space-y-6">
          {articles.length > 0 ? (
            articles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 border border-gray-200">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                        {article.category_name}
                      </span>
                      <span className="text-sm text-gray-500">
                        Vol. {article.volume}, Issue {article.issue}
                      </span>
                    </div>

                    {/* Link uses slug, not id */}
                    <Link to={`/articles/${article.slug}`}>
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition">
                        {article.title}
                      </h2>
                    </Link>

                    <div className="text-sm text-gray-700 mb-3">
                      <strong>Authors:</strong>{' '}
                      {article.authors.map(a => a.author_name).join(', ')}
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.abstract}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {(article.keywords_list || []).map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:ml-4">
                    <Link
                      to={`/articles/${article.slug}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center text-sm font-medium whitespace-nowrap"
                    >
                      View Article
                    </Link>
                    {article.published_pdf && (
                      <a
                        href={article.published_pdf}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-center text-sm font-medium whitespace-nowrap flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        PDF
                      </a>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500">
                  <div><strong>DOI:</strong> {article.doi}</div>
                  <div className="flex gap-4">
                    <span>Pages: {article.pages}</span>
                    <span>👁 {article.views_count} views</span>
                    <span>⬇ {article.downloads_count} downloads</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No articles found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg transition ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
