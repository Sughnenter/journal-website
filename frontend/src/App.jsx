import {Footer} from './components/Footer';
import {Header} from './components/Header';
import {HomePage} from './pages/HomePage'
import {ArticlesPage} from './pages/ArticlesPage';
import {ArticleDetailPage} from './pages/ArticleDetailPage';
import {SubmitPage} from './pages/SubmitPage';
import {AboutPage} from './pages/AboutPage';
import {DashboardPage} from './pages/DashboardPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import {ProfilePage} from './pages/ProfilePage'
import { AuthProvider } from './context/AuthContext';
import {ProtectedRoute} from './components/ProtectedRoute';
import { Navigation } from './components/Navigation';
import {Routes, Route, Router, Link} from 'react-router';

//import axios from "axios";



function AppContent(){
  return(
    <>
      
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        {/* Main Content */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:id" element={<ArticleDetailPage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
        </Routes>

        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}

function App() {
  return (
      <AuthProvider>
        <AppContent />
      </AuthProvider>
  );
}

export default App