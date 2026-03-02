import React from 'react'

import './Header.css';
export function Header () {
  return (
    <>
      {/* Navigation */}
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">J</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Journal of Applied Sciences</h1>
                  <p className="text-xs text-gray-500">University Research Publication</p>
                </div>
              </Link>
              
              <div className="hidden md:flex space-x-8">
                <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition">Home</Link>
                <Link to="/articles" className="text-gray-700 hover:text-blue-600 font-medium transition">Articles</Link>
                <Link to="/submit" className="text-gray-700 hover:text-blue-600 font-medium transition">Submit</Link>
                <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition">About</Link>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button className="text-gray-700 hover:text-blue-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>
    </>
  )
}

