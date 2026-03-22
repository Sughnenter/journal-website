import React, { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";

export function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">J</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Journal of Biological Science Sciences
              </h1>
              <p className="text-xs text-gray-500">
                Federal University of Agriculture Makurdi(FUAM)
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
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

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.first_name?.[0]}
                        {user?.last_name?.[0]}
                      </span>
                    </div>
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Register
                </Link>
              </div>
            )}
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
            <Link
              to="/login"
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition"
              onClick={() => setToggleMenu(false)}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition"
              onClick={() => setToggleMenu(false)}
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
