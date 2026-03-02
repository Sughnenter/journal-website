import React from 'react'
import {Link} from 'react-router'

export function Footer () {
  return (
    <footer className="bg-gray-900 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">About the Journal</h3>
                <p className="text-gray-400 text-sm">
                  A peer-reviewed academic journal publishing cutting-edge research in applied sciences.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/articles" className="text-gray-400 hover:text-white transition">Browse Articles</Link></li>
                  <li><Link to="/submit" className="text-gray-400 hover:text-white transition">Submit Manuscript</Link></li>
                  <li><Link to="/about" className="text-gray-400 hover:text-white transition">Editorial Board</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <p className="text-gray-400 text-sm">
                  Email: journal@university.edu<br />
                  Phone: +234 XXX XXX XXXX
                </p>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
              <p>&copy; 2024 Journal of Applied Sciences. All rights reserved.</p>
            </div>
          </div>
        </footer>
  )
}

