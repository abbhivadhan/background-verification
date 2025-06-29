import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Users, FileCheck, BarChart3 } from 'lucide-react'
import './App.css'

// Import components
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import CandidateManagement from './components/CandidateManagement'
import BackgroundCheckManagement from './components/BackgroundCheckManagement'
import Reports from './components/Reports'
import CandidateForm from './components/CandidateForm'
import BackgroundCheckDetails from './components/BackgroundCheckDetails'

function App() {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // Simulate user authentication
    setCurrentUser({
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin'
    })
  }, [])

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Background Check System</h1>
          <p className="text-gray-600">Loading...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar currentUser={currentUser} />
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/candidates" element={<CandidateManagement />} />
            <Route path="/candidates/new" element={<CandidateForm />} />
            <Route path="/candidates/:id/edit" element={<CandidateForm />} />
            <Route path="/background-checks" element={<BackgroundCheckManagement />} />
            <Route path="/background-checks/:id" element={<BackgroundCheckDetails />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

