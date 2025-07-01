import React,{useState, useEffect} from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import LandingPage from './components/pages/LandingPage'; // This will be redesigned
import BuildPage from './components/pages/BuildPage'; // Keep existing routing
import ImportPage from './components/pages/ImportPage'; // Keep existing routing
import CodeOutputPage from './components/pages/CodeOutputPage'; // Keep existing routing
import LoginPage from './components/pages/LoginPage';
import Waitlist from './components/pages/Waitlist';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GeminiApiKeyModal from './components/GeminiApiKeyModal';

import './index.css'; // Keep your existing App.css if needed, or replace with Tailwind setup
import './App.css'; // Keep your existing App.css if needed, or replace with Tailwind setup
import { AuthProvider } from './context/AuthContext';



function App() {

  useEffect(() => {
    localStorage.removeItem('historyview');
 
  }, []);


  

  return (
    <Router>
      <AuthProvider>
        <div className="font-sans antialiased bg-gray-50 min-h-screen">
          <style>
            {`
            .min-h-screen-nav {
              min-height: calc(100vh - 64px);
              padding-top: 64px;
            }
            `}
          </style>

          <GeminiApiKeyModal />

        <Helmet>
    <meta name="description" content="Transform your app ideas into functional code with VibeBuilder (vb2). AI-powered PRD generation, task breakdown, and interactive code editing with built-in unit testing. Get production-ready web and mobile apps faster." />
    <meta name="keywords" content="AI code generation, app idea to code, web app generator, mobile app generator, software development AI, AI PRD generator, automated code, AI development assistant, functional code, unit testing AI, AI copilot, no-code, low-code" />
    <meta property="og:title" content="VibeBuilder (vb2): From Idea to Production-Ready Code with AI" />
    <meta property="og:description" content="Transform your app ideas into functional code with VibeBuilder (vb2). AI-powered PRD generation, task breakdown, and interactive code editing with built-in unit testing. Get production-ready web and mobile apps faster." />
    <meta property="og:image" content="https://res.cloudinary.com/djpcokxvn/image/upload/v1727230433/2024-09-25_03_12_49-QuickSum_and_10_more_pages_-_Personal_-_Microsoft_Edge_i6ylfp.png" />
    <meta property="og:url" content="https://vb-2.netlify.app/" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="VibeBuilder (vb2): From Idea to Production-Ready Code with AI" />
    <meta name="twitter:description" content="Transform your app ideas into functional code with VibeBuilder (vb2). AI-powered PRD generation, task breakdown, and interactive code editing with built-in unit testing. Get production-ready web and mobile apps faster." />
    <meta name="twitter:image" content="https://res.cloudinary.com/djpcokxvn/image/upload/v1727230433/2024-09-25_03_12_49-QuickSum_and_10_more_pages_-_Personal_-_Microsoft_Edge_i6ylfp.png" />
</Helmet>
          <Switch>
            <Route exact path="/" component={BuildPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/waitlist" component={Waitlist} />
            <Route path="/generate" component={BuildPage} />
            <Route path="/import_project" component={ImportPage} />
            <Route path="/code_output" component={CodeOutputPage} />

            <Route render={() => <Redirect to="/generate" />} />
          </Switch>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
