import React from 'react'

export function AboutPage  () {
  const editorialBoard = [
    { name: "Prof. Elizabeth Thompson", role: "Editor-in-Chief", affiliation: "Harvard University" },
    { name: "Dr. Ahmed Ibrahim", role: "Associate Editor", affiliation: "MIT" },
    { name: "Prof. Sarah Chen", role: "Associate Editor", affiliation: "Stanford University" },
    { name: "Dr. Michael Rodriguez", role: "Managing Editor", affiliation: "University of Cambridge" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About the Journal</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Learn more about our mission, editorial board, and publication standards
        </p>
      </div>

      {/* Mission Statement */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mission Statement</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The Journal of Applied Sciences is a premier peer-reviewed academic journal dedicated to publishing high-quality research across multiple scientific disciplines. Our mission is to advance scientific knowledge and promote innovation by providing a platform for researchers worldwide to share their groundbreaking discoveries.
        </p>
        <p className="text-gray-700 leading-relaxed">
          We are committed to maintaining the highest standards of scientific integrity, promoting open access to research, and fostering collaboration across international boundaries. Our interdisciplinary approach encourages cross-pollination of ideas and methodologies, driving innovation and progress in the scientific community.
        </p>
      </div>

      {/* Scope and Coverage */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Scope and Coverage</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-l-4 border-blue-600 pl-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Computer Science</h3>
            <p className="text-gray-600 text-sm">Artificial Intelligence, Machine Learning, Data Science, Cybersecurity, Quantum Computing</p>
          </div>
          <div className="border-l-4 border-green-600 pl-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Agriculture</h3>
            <p className="text-gray-600 text-sm">Sustainable Farming, Crop Science, Soil Management, Agricultural Technology, Food Security</p>
          </div>
          <div className="border-l-4 border-yellow-600 pl-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Environmental Science</h3>
            <p className="text-gray-600 text-sm">Climate Change, Ecology, Conservation, Pollution Control, Renewable Energy</p>
          </div>
          <div className="border-l-4 border-red-600 pl-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Medical Science</h3>
            <p className="text-gray-600 text-sm">Biotechnology, Drug Discovery, Public Health, Medical Imaging, Genomics</p>
          </div>
          <div className="border-l-4 border-purple-600 pl-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Engineering</h3>
            <p className="text-gray-600 text-sm">Civil, Mechanical, Electrical, Chemical Engineering, Materials Science</p>
          </div>
          <div className="border-l-4 border-pink-600 pl-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Neuroscience</h3>
            <p className="text-gray-600 text-sm">Cognitive Science, Brain Imaging, Neural Networks, Behavioral Science</p>
          </div>
        </div>
      </div>

      {/* Editorial Board */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Editorial Board</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {editorialBoard.map((member, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-blue-600 mb-1">{member.role}</p>
                <p className="text-sm text-gray-600">{member.affiliation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Publication Ethics */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Publication Ethics</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Originality</h3>
              <p className="text-gray-600 text-sm">All submitted manuscripts must be original work that has not been published elsewhere.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Peer Review</h3>
              <p className="text-gray-600 text-sm">All articles undergo rigorous double-blind peer review by experts in the field.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Data Integrity</h3>
              <p className="text-gray-600 text-sm">Authors must ensure the accuracy of their data and provide access to raw data when requested.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Conflicts of Interest</h3>
              <p className="text-gray-600 text-sm">Authors must disclose any financial or personal relationships that could influence their work.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 mb-8 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Journal Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">2.8</div>
            <div className="text-blue-100">Impact Factor</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">45</div>
            <div className="text-blue-100">Days to Review</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">35%</div>
            <div className="text-blue-100">Acceptance Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-blue-100">Articles/Year</div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Editorial Office</h3>
            <div className="space-y-2 text-gray-600">
              <p className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>editor@journal.edu</span>
              </p>
              <p className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+234 XXX XXX XXXX</span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Submissions</h3>
            <div className="space-y-2 text-gray-600">
              <p className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>submissions@journal.edu</span>
              </p>
              <p className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Response within 24-48 hours</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

