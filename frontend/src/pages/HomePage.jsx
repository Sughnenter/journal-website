import React from 'react'
import { getLatestArticles } from '../data/mockData';
import {Link} from 'react-router';

export function HomePage  () {
  const latestArticles = getLatestArticles(4);
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Journal of Biological Sciences
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Advancing Research, Inspiring Innovation
            </p>
            <p className="text-lg mb-8 max-w-3xl mx-auto text-blue-50">
              A peer-reviewed, open-access journal publishing cutting-edge research across multiple disciplines including computer science, agriculture, environmental studies, and medical sciences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/articles" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Browse Articles
              </Link>
              <Link 
                to="/submit" 
                className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition border-2 border-white"
              >
                Submit Manuscript
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <div className="text-gray-600 mt-2">Published Articles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">15</div>
              <div className="text-gray-600 mt-2">Years Publishing</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">98%</div>
              <div className="text-gray-600 mt-2">Acceptance Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">45</div>
              <div className="text-gray-600 mt-2">Countries Represented</div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Articles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Latest Publications</h2>
          <Link to="/articles" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
            View All
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {latestArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  {article.category}
                </span>
                <span className="text-sm text-gray-500">{article.month} {article.year}</span>
              </div>
              
              <Link to={`/articles/${article.id}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition">
                  {article.title}
                </h3>
              </Link>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {article.abstract}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {article.keywords.slice(0, 3).map((keyword, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {keyword}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  {article.authors[0]} {article.authors.length > 1 && `+${article.authors.length - 1}`}
                </div>
                <Link 
                  to={`/articles/${article.id}`}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                >
                  Read More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Submit Your Research
                </h2>
                <p className="text-gray-600 mb-6">
                  Join our community of researchers and share your groundbreaking work with the world. We offer rapid peer review and open access publication.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Fast peer review process</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Open access publication</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Global readership</span>
                  </li>
                </ul>
                <Link 
                  to="/submit"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Submit Manuscript
                </Link>
              </div>
              <div className="hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=600&h=400&fit=crop" 
                  alt="Research" 
                  className="rounded-lg shadow-lg w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


