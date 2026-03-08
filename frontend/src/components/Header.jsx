import React, { useState } from "react";
import { Link } from "react-router";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";

export function Header() {
  const [toggleMenu, setToggleMenu] = useState(false);
  return (
    <>
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50 py-2 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">J</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900  ">
                  Journal of Biological Science Sciences
                </h1>
                <p className="text-xs text-gray-500  ">
                  Federal University of Agriculture Makurdi(FUAM)
                </p>
              </div>
            </Link>

            <div className="hidden md:flex space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Home
              </Link>
              <Link
                to="/articles"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Articles
              </Link>
              <Link
                to="/submit"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Submit
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                About
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setToggleMenu(!toggleMenu)}
                className="text-gray-700 hover:text-blue-600"
              >
                {toggleMenu ? (
                  <RiCloseLine className="h-6 w-6" />
                ) : (
                  <RiMenu3Line className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {toggleMenu && (
            <div className="md:hidden pb-4 border-t border-gray-200">
              <Link
                to="/"
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition"
                onClick={() => setToggleMenu(false)}
              >
                Home
              </Link>
              <Link
                to="/articles"
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition"
                onClick={() => setToggleMenu(false)}
              >
                Articles
              </Link>
              <Link
                to="/submit"
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition"
                onClick={() => setToggleMenu(false)}
              >
                Submit
              </Link>
              <Link
                to="/about"
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition"
                onClick={() => setToggleMenu(false)}
              >
                About
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
