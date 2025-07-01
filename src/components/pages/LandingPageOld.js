import React from 'react';
import Logo from '../../assets/images/logo-white.png'
import LogoColor from '../../assets/images/logo-color.png'
import { useAuth } from '../../context/AuthContext';
import './landing.css'



function Navbar() {
const { user, logout} = useAuth()
  return (
    <nav className="bg-white shadow-md fixed w-full z-10">
      <div className="container mx-auto px-6 py-0 flex justify-between items-center">
       <div className="flex items-center">
        <img src={Logo} alt="VB2 Logo" className="h-8 w-auto mr-3"/> 
        <div className="text-2xl font-bold text-gray-800">VB2</div>
        </div>
        <div className="hidden md:flex space-x-6">
          <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How it Works</a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
          {/* Add more links as needed */}
        </div>
        {/* Action Buttons */}
        <div className="flex items-center space-x-6">
           {!user ? <button className="text-gray-600 hover:text-gray-900" onClick={()=>window.location.href='/login'}>Login</button>:<></>}
            {user ?    <button className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-blue-700" onClick={logout}>Logout</button>:
          <button className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-blue-700">Sign Up</button>}
        </div>
      </div>
    </nav>
  );
}


 
 
function Hero() {
  return (<>

    <section style={{'zIndex':0}} 
    className="relative bg-gradient-to-br from-purple-500 to-gray-900 text-white py-20 md:py-32 flex items-center justify-center min-h-screen-nav"> {/* min-h-screen-nav needs custom CSS or adjust padding */}
      <div className="container mx-auto px-6 text-center z-10">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Turn Your Ideas into Code, Instantly.
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto" style={{lineHeight:'2.5rem'}}>
          VB2 uses AI to transform your project concepts and requirements into ready-to-work application code, accelerating your development process.
        </p>
        <div className="space-x-4 py-6">
          <button onClick={()=>window.location.href = '/generate'} className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-md shadow-lg hover:bg-gray-600">
       <div className="flex items-center">
           <img src={LogoColor} alt="VB2 Logo" className="h-8 w-auto mr-3"/> 
            <span> Start Building</span></div>
          </button>
          <button onClick={()=>window.location.href = '/import_project'} className="px-8 py-3 border border-white text-white font-semibold rounded-md hover:bg-gray-600 hover:text-blue-600">
                  <div className="flex items-center">
           <img src={Logo} alt="VB2 Logo" className="h-8 w-auto mr-3"/>  <span> Import Project
           </span></div>
          </button>
        </div>
      </div>
      {/* Add a background graphic or illustration here */}
       {/* Example placeholder div */}
       <div className="absolute inset-0 z-0 opacity-20">
           {/* Replace with your actual background graphic */}
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
               <polygon points="0,100 100,100 100,0" fill="currentColor" />
           </svg>
       </div>
    </section>
    </>
  );
}

// src/components/FeaturesOverview.js
function FeaturesOverview() {
  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          Accelerate Your Development Workflow
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
           VB2 handles the initial coding so you can focus on innovation, customization, and bringing your unique vision to life.
        </p>
        {/* Add a grid of icons/short descriptions here */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
                {/* Icon Placeholder */}
                <div className="text-4xl text-blue-600 mb-4">💡</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Idea to Code</h3>
                <p className="text-gray-600">Transform concepts into foundational code rapidly.</p>
            </div>
             <div className="p-6 bg-white rounded-lg shadow-md">
                {/* Icon Placeholder */}
                <div className="text-4xl text-green-600 mb-4">🤖</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Copilot</h3>
                <p className="text-gray-600">Get intelligent assistance directly in your editor.</p>
            </div>
             <div className="p-6 bg-white rounded-lg shadow-md">
                {/* Icon Placeholder */}
                <div className="text-4xl text-purple-600 mb-4">📂</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Structured Output</h3>
                <p className="text-gray-600">Receive clean, organized, and ready-to-work code.</p>
            </div>
        </div>
      </div>
    </section>
  );
}

// src/components/DetailedFeature.js
function DetailedFeature({ title, description, visual, layout }) {
  const isImageRight = layout === 'image-right';

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        {/* Text Content */}
        <div className={`w-full md:w-1/2 ${isImageRight ? 'md:order-1' : 'md:order-2'}`}>
          <h3 className="text-3xl font-bold text-gray-800 mb-4">{title}</h3>
          <p className="text-lg text-gray-600">{description}</p>
        </div>
        {/* Visual Content */}
        <div className={`w-full md:w-1/2 ${isImageRight ? 'md:order-2' : 'md:order-1'}`}>
          {/* Replace with your actual image or visual component */}
          <img src={visual} alt={title} className="rounded-lg shadow-lg w-full h-auto" onError={(e) => e.target.src='https://placehold.co/600x400/E5E7EB/4B5563?text=Visual+Placeholder'} />
        </div>
      </div>
    </section>
  );
}

// src/components/HowItWorks.js
function HowItWorks() {
    return (
        <section id="how-it-works" className="py-16 bg-gray-100">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
                    How VB2 Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
                        <div className="text-4xl text-blue-600 mb-4">1️⃣</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Input Your Idea</h3>
                        <p className="text-gray-600">Describe your project or upload requirements.</p>
                    </div>
                     {/* Step 2 */}
                    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
                        <div className="text-4xl text-green-600 mb-4">2️⃣</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Generates Code</h3>
                        <p className="text-gray-600">VB2 analyzes input and generates initial code.</p>
                    </div>
                     {/* Step 3 */}
                    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
                        <div className="text-4xl text-purple-600 mb-4">3️⃣</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Edit with Copilot</h3>
                        <p className="text-gray-600">Refine and expand code using the AI Copilot.</p>
                    </div>
                     {/* Step 4 */}
                    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
                        <div className="text-4xl text-red-600 mb-4">4️⃣</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Save & Build</h3>
                        <p className="text-gray-600">Save code locally and integrate into your workflow.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}


// src/components/CallToAction.js
function CallToAction() {
  return (
    <section className="py-20 bg-blue-600 text-white text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Build Faster?
        </h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto">
          Stop writing boilerplate code and start focusing on what makes your application unique.
        </p>
        <button onClick={()=>window.location.href = '/generate'} className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-md shadow-lg hover:bg-gray-100 text-lg">
          Get Started Free
        </button>
      </div>
    </section>
  );
}

// src/components/Footer.js
function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Description */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">VB2</h3>
          <p className="text-gray-400">
            AI-powered platform to turn your ideas into application code, fast.
          </p>
        </div>
        {/* Navigation Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Product</h4>
          <ul>
            <li className="mb-2"><a href="#features" className="hover:text-white">Features</a></li>
            <li className="mb-2"><a href="#how-it-works" className="hover:text-white">How it Works</a></li>
            <li className="mb-2"><a href="#pricing" className="hover:text-white">Pricing</a></li>
          </ul>
        </div>
        {/* Resources Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Resources</h4>
          <ul>
            <li className="mb-2"><a href="#" className="hover:text-white">Documentation</a></li>
            <li className="mb-2"><a href="#" className="hover:text-white">Blog</a></li>
            <li className="mb-2"><a href="#" className="hover:text-white">Support</a></li>
          </ul>
        </div>
        {/* Company Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul>
            <li className="mb-2"><a href="#" className="hover:text-white">About Us</a></li>
            <li className="mb-2"><a href="#" className="hover:text-white">Careers</a></li>
            <li className="mb-2"><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-gray-500 mt-8">
        &copy; {new Date().getFullYear()} VB2. All rights reserved.
      </div>
    </footer>
  );
}


// Main App Component
function App() {
  return (
    <div className="font-sans antialiased">
      {/* Link to Tailwind CSS CDN - for quick setup */}
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"></link>
      {/* Custom CSS for padding below fixed navbar */}
      <style>
        {`
        .min-h-screen-nav {
          min-height: calc(100vh - 64px); /* Adjust 64px based on your navbar height */
          padding-top: 64px; /* Add padding to prevent content from being hidden behind fixed navbar */
        }`
        }
      </style>

      <Navbar />
      <Hero />

      <FeaturesOverview />
      {/* Example usage of DetailedFeature component */}
      <DetailedFeature
        title="From Idea to Initial Codebase"
        description="Simply describe your project idea or upload detailed requirements documents. VB2's AI analyzes your input, breaks it down into manageable tasks, and generates the foundational application code structure."
        visual="https://placehold.co/600x400/E5E7EB/4B5563?text=Idea+to+Code+Visual" // Replace with actual image
        layout="image-right"
      />
       <DetailedFeature
        title="Intelligent AI Copilot in Your Editor"
        description="Seamlessly integrated into your preferred code editor, the VB2 AI Copilot helps you understand generated code, refactor sections, debug, and add new features based on your natural language instructions."
        visual="https://placehold.co/600x400/E5E7EB/4B5563?text=Copilot+Visual" // Replace with actual image
        layout="image-left"
      />
        <DetailedFeature
        title="Import and Enhance Existing Projects"
        description="Bring your existing code projects into VB2 to leverage the AI Copilot and other powerful features. Get help understanding complex code, optimizing performance, or adding new functionality."
        visual="https://placehold.co/600x400/E5E7EB/4B5563?text=Import+Project+Visual" // Replace with actual image
        layout="image-right"
      />
      {/* Add more DetailedFeature sections as needed */}
      <HowItWorks />
      <CallToAction />
      <Footer />
    </div>
  );
}

export default App;
