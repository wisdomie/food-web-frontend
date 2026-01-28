/**
 * Main App Component
 *
 * Root component for the Food Recognition application with routing and authentication
 */

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import ImageUpload from './components/ImageUpload';
import ResultsDisplay from './components/ResultsDisplay';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UserProfileSetup from './components/UserProfileSetup';
import ChatInterface from './components/Chat/ChatInterface';
import MealHistoryPanel from './components/MealHistoryPanel';
import './styles/App.css';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Auth Page (Login/Register)
function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>AI Food Recognition</h1>
          <p>Your personal nutrition assistant</p>
        </div>
        {isLogin ? (
          <Login
            onSwitchToRegister={() => setIsLogin(false)}
            onSuccess={() => {}}
          />
        ) : (
          <Register
            onSwitchToLogin={() => setIsLogin(true)}
            onSuccess={() => {}}
          />
        )}
      </div>
    </div>
  );
}

// Main Home Page (Food Analysis)
function HomePage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
    setResults(null);
  };

  const handleAnalysisComplete = (analysisResults) => {
    setResults(analysisResults);
    setLoading(false);
  };

  const handleAnalysisError = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  };

  const handleAnalysisStart = () => {
    setLoading(true);
    setError(null);
    setResults(null);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResults(null);
    setError(null);
    setLoading(false);
  };

  return (
    <main className="app-main">
      {!results ? (
        <ImageUpload
          selectedImage={selectedImage}
          previewUrl={previewUrl}
          loading={loading}
          onImageSelect={handleImageSelect}
          onAnalysisStart={handleAnalysisStart}
          onAnalysisComplete={handleAnalysisComplete}
          onAnalysisError={handleAnalysisError}
        />
      ) : (
        <ResultsDisplay
          results={results}
          previewUrl={previewUrl}
          onReset={handleReset}
        />
      )}

      {error && (
        <div className="error-message">
          <div className="error-icon">!</div>
          <p>{error}</p>
          <button onClick={handleReset} className="btn-secondary">
            Try Again
          </button>
        </div>
      )}
    </main>
  );
}

// Profile Setup Page
function ProfilePage() {
  const { user } = useAuth();
  const [showSetup, setShowSetup] = useState(!user?.profile);

  if (showSetup) {
    return (
      <div className="profile-page">
        <UserProfileSetup
          onComplete={() => setShowSetup(false)}
          onSkip={() => setShowSetup(false)}
        />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-view">
        <h2>Your Profile</h2>
        {user?.profile ? (
          <div className="profile-details">
            <div className="profile-section">
              <h3>Health Goals</h3>
              <div className="tag-list">
                {(user.profile.health_goals || []).map(goal => (
                  <span key={goal} className="tag">{goal.replace('_', ' ')}</span>
                ))}
                {(!user.profile.health_goals || user.profile.health_goals.length === 0) && (
                  <span className="no-data">No goals set</span>
                )}
              </div>
            </div>
            <div className="profile-section">
              <h3>Dietary Restrictions</h3>
              <div className="tag-list">
                {(user.profile.dietary_restrictions || []).map(r => (
                  <span key={r} className="tag">{r.replace('_', ' ')}</span>
                ))}
                {(!user.profile.dietary_restrictions || user.profile.dietary_restrictions.length === 0) && (
                  <span className="no-data">No restrictions</span>
                )}
              </div>
            </div>
            {user.profile.calorie_target && (
              <div className="profile-section">
                <h3>Daily Calorie Target</h3>
                <p className="calorie-target">{user.profile.calorie_target} cal</p>
              </div>
            )}
          </div>
        ) : (
          <p>No profile set up yet.</p>
        )}
        <button className="btn-primary" onClick={() => setShowSetup(true)}>
          Edit Profile
        </button>
      </div>
    </div>
  );
}

// History Page
function HistoryPage() {
  return (
    <div className="history-page">
      <MealHistoryPanel />
    </div>
  );
}

// Chat Page
function ChatPage() {
  return (
    <ChatProvider>
      <div className="chat-page">
        <ChatInterface />
      </div>
    </ChatProvider>
  );
}

// Navigation Component
function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="app-nav">
      <div className="nav-brand">
        <Link to="/">AI Food Recognition</Link>
      </div>

      <div className="nav-links">
        <Link to="/" className="nav-link">Analyze</Link>
        {isAuthenticated && (
          <>
            <Link to="/chat" className="nav-link">Diet Advisor</Link>
            <Link to="/history" className="nav-link">History</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
          </>
        )}
      </div>

      <div className="nav-user">
        {isAuthenticated ? (
          <>
            <span className="username">{user?.username}</span>
            <button className="btn-logout" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-login">Login</Link>
        )}
      </div>
    </nav>
  );
}

// Main App with Router
function AppContent() {
  return (
    <div className="App">
      <Navigation />

      <div className="app-container">
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/" element={<HomePage />} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
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
      </div>

      <footer className="app-footer">
        <p>
          Powered by EfficientNet | USDA FoodData Central | OpenAI GPT
        </p>
        <p className="footer-note">
          BSc Computer Science Final Year Project
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
