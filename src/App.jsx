import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LeadForm from './components/LeadForm';
import LeadList from './components/LeadList';
import DisbursementForm from './components/DisbursementForm';
import DisbursementList from './components/DisbursementList';
import Dashboard from './components/Dashboard';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'New Lead', href: '/leads/new' },
    { name: 'View Leads', href: '/leads' },
    { name: 'New Disbursement', href: '/disbursements/new' },
    { name: 'View Disbursements', href: '/disbursements' },
  ];

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Header */}
        <nav className="bg-blue-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold">Wheel Web Leads</h1>
              </div>
              {/* Mobile menu button */}
              <div className="flex items-center sm:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {isOpen ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
              {/* Desktop menu */}
              <div className="hidden sm:flex sm:space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <div className="sm:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:space-x-8">
            <div className="lg:w-1/4 hidden lg:block">
              {/* Sidebar navigation for large screens */}
              <nav className="mt-6">
                <h2 className="text-sm font-medium text-gray-500">Navigation</h2>
                <div className="mt-4 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-blue-700"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </nav>
            </div>
            <div className="lg:w-3/4">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/leads/new" element={<LeadForm />} />
                <Route path="/leads" element={<LeadList />} />
                <Route path="/disbursements/new" element={<DisbursementForm />} />
                <Route path="/disbursements" element={<DisbursementList />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;