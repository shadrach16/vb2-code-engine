import React from 'react';

// Placeholder for your Logo. You can replace this with your actual logo import.
const Logo = 'https://placehold.co/32x32/1a1a1a/ffffff?text=VB'; 

// Placeholder images for the web IDE and feature screenshots.
const BlueprintMockup = 'https://placehold.co/600x400/2d2d2d/ffffff?text=Blueprint+Process+Mockup';
const AICopilotMockup = 'https://placehold.co/600x400/2d2d2d/ffffff?text=AI+Copilot+Code+Screenshot';
const TaskBreakdownMockup = 'https://placehold.co/600x400/2d2d2d/ffffff?text=Task+Breakdown+Screenshot';
const UnitTestingMockup = 'https://placehold.co/600x400/2d2d2d/ffffff?text=Unit+Testing+Interface';
const PrivacyLockIcon = 'https://placehold.co/80x80/2d2d2d/ff7300?text=🔒'; 

const App = () => {
  return (
    <div className="bg-black text-white font-inter">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 border-b border-gray-800 backdrop-blur-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center cursor-pointer" onClick={() => window.location.href = "/"}>
            <img src={Logo} alt="VB2 Logo" className="w-8 h-8 rounded-full mr-2" />
            <span className="text-xl font-bold">VB2</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-400 hover:text-white transition">Features</a>
            <a href="#privacy" className="text-gray-400 hover:text-white transition">Privacy</a>
            <a href="#testimonials" className="text-gray-400 hover:text-white transition">Community</a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition">Pricing</a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white transition px-3 py-1.5 rounded-md text-sm">Log in</button>
            <button className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition text-sm font-semibold">Download Code</button> 
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center px-4 pt-16 overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3C/g%3E%3C/svg%3E")'
        }}></div>

        <div className="relative z-10 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
            Your <span className="text-red-500">AI Software Engineer Partner</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            VibeBuilder fundamentally changes how software ideas are developed, guiding you from a raw concept to a functional application with a seamless, AI-powered blueprint process.
          </p>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
            Start Your Blueprint
          </button>
          {/* Placeholder for the central IDE image - showcasing the blueprint UI */}
          <div className="mt-12 flex justify-center">
            <img src={BlueprintMockup} alt="VibeBuilder Blueprint Interface Mockup" className="w-full max-w-3xl rounded-lg shadow-2xl border border-gray-700" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          {/* Feature: Rapidly Transform Ideas & AI-Powered Customization */}
          <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
            <div className="md:w-1/2">
              <h2 className="text-purple-400 text-lg font-semibold mb-2">#IdeaToPRD</h2>
              <h3 className="text-4xl font-bold leading-tight mb-4">
                Transform Ideas into Detailed PRDs with AI Customization
              </h3>
              <p className="text-gray-400 text-lg">
                Input web or mobile app concepts, even non-technical ones. Our AI engages you with deep, non-technical questions and multiple-choice options to thoroughly refine and customize every aspect of your app's functionality. This interaction culminates in the instant generation of a comprehensive Product Requirements Document (PRD), providing a solid foundation for development.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img src={BlueprintMockup} alt="PRD Generation Mockup" className="w-full max-w-lg rounded-lg shadow-lg border border-gray-700" />
            </div>
          </div>

          {/* Feature: Automated Task Breakdown & Code Generation */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 mb-20">
            <div className="md:w-1/2">
              <h2 className="text-red-400 text-lg font-semibold mb-2">#CodeGeneration</h2>
              <h3 className="text-4xl font-bold leading-tight mb-4">
                Automated Task Breakdown & Full Codebase Generation
              </h3>
              <p className="text-gray-400 text-lg">
                Once your PRD is complete, VibeBuilder's AI agents break it down into small, manageable development tasks. Each task is then fed to a specialized coder AI that generates functional code snippets. This iterative process continues until a full, comprehensive codebase is ready for download, compatible with any language or framework.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img src={TaskBreakdownMockup} alt="Task Breakdown & Code Generation Mockup" className="w-full max-w-lg rounded-lg shadow-lg border border-gray-700" />
            </div>
          </div>

          {/* Feature: Interactive AI Copilot for Code Refinement */}
          <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
            <div className="md:w-1/2">
              <h2 className="text-green-400 text-lg font-semibold mb-2">#AICopilot</h2>
              <h3 className="text-4xl font-bold leading-tight mb-4">
                Interactive AI Copilot for Seamless Code Refinement
              </h3>
              <p className="text-gray-400 text-lg">
                Empower your developers with an integrated AI Copilot to edit, delete, or create any part of the generated code directly within the web IDE. This ensures seamless integration with your existing standards and bespoke requirements, giving you full control over the final output.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img src={AICopilotMockup} alt="AI Copilot Refinement Mockup" className="w-full max-w-lg rounded-lg shadow-lg border border-gray-700" />
            </div>
          </div>

          {/* Feature: Automated Unit Test Checker & One-Click Fixes */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-blue-400 text-lg font-semibold mb-2">#QualityAssurance</h2>
              <h3 className="text-4xl font-bold leading-tight mb-4">
                Automated QA: Unit Test Checker & One-Click Fixes
              </h3>
              <p className="text-gray-400 text-lg">
                Our system automatically scans the generated codebase for any areas that don't meet acceptance criteria or contain logical errors. It provides clear listings of issues and suggested fixes. A unique "single fix button" allows for automated correction of identified issues, drastically reducing manual debugging time and ensuring high code quality.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img src={UnitTestingMockup} alt="Unit Testing & One-Click Fix Mockup" className="w-full max-w-lg rounded-lg shadow-lg border border-gray-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Privacy and Security Section */}
      <section id="privacy" className="py-20 px-4 bg-gray-950">
        <div className="container mx-auto text-center">
          <img src={PrivacyLockIcon} alt="Privacy Icon" className="mx-auto mb-8 w-20 h-20" />
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Privacy and Security
          </h2>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            We prioritize protecting users’ privacy and data security, adhering to the principle of "local-first" and "minimal data collection".
            <br />Your generated code is private and not shared with others.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Privacy Feature 1 */}
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
              <h3 className="text-xl font-semibold mb-3">Local Data Storage</h3>
              <p className="text-gray-400">
                Codebase files are stored locally on your devices. For indexing, files may be temporarily uploaded for embedding. After processing, all plaintext is deleted.
              </p>
            </div>
            {/* Privacy Feature 2 */}
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
              <h3 className="text-xl font-semibold mb-3">Secure Data Access</h3>
              <p className="text-gray-400">
                Strict access control and encrypted transmission are enforced to prevent unauthorized access and reduce exposure to security risks.
              </p>
            </div>
            {/* Privacy Feature 3 */}
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
              <h3 className="text-xl font-semibold mb-3">Regional Deployment</h3>
              <p className="text-gray-400">
                User data and infrastructure are deployed based on account location, stored in the United States, Singapore, and Malaysia, with isolation in place to meet local data regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold leading-tight mb-12">
            Loved by Devs
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700">
              <p className="text-gray-300 italic mb-4">
                "I'm experimenting with AI tools. I've built a full-fledged application in two weeks. I know there are tools that can build it with a prompt, but doing it incrementally feels more satisfying. @vb2_ai"
              </p>
              <div className="text-right text-gray-500">- AlexS</div>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700">
              <p className="text-gray-300 italic mb-4">
                "Tested multiple AI coding platforms and I have to say @vb2_ai has surpassed them all. Massive applause and respect for the effort!"
              </p>
              <div className="text-right text-gray-500">- Ast. JXS</div>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700">
              <p className="text-gray-300 italic mb-4">
                "Writing code has never been that easier! VibeBuilder helps me generate efficient code on the fly. A game-changer."
              </p>
              <div className="text-right text-gray-500">- Gary</div>
            </div>
            {/* Testimonial 4 */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700">
              <p className="text-gray-300 italic mb-4">
                "VibeBuilder is so freaking amazing that I'm starting to worry my job's gonna vanish into thin air."
              </p>
              <div className="text-right text-gray-500">- IndieMike</div>
            </div>
            {/* Testimonial 5 */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700">
              <p className="text-gray-300 italic mb-4">
                "In terms of code generation speed, VibeBuilder is quite impressive. When the network connection is good, it can quickly generate code snippets according to my requests, improving my productivity."
              </p>
              <div className="text-right text-gray-500">- ChristineCT</div>
            </div>
            {/* Add more testimonials as needed */}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-950">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Pricing
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Get started for Free. Upgrade to increase limits.
          </p>

          {/* Monthly/Yearly Toggle (simplified) */}
          <div className="inline-flex bg-gray-800 rounded-lg p-1 mb-12">
            <button className="px-6 py-2 rounded-lg bg-gray-700 text-white font-semibold text-sm shadow-md">Monthly</button>
            <button className="px-6 py-2 rounded-lg text-gray-400 font-semibold text-sm">Yearly -25%</button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan Card */}
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
              <h3 className="text-2xl font-bold mb-4">Free</h3>
              <p className="text-4xl font-bold mb-2">$0</p>
              <p className="text-gray-400 mb-6">per month, no credit card required</p>
              <button className="w-full bg-gray-700 text-white py-3 rounded-md hover:bg-gray-600 transition font-semibold text-lg">
                Access Web IDE
              </button>
              <div className="mt-6 text-gray-400 text-sm">
                <p className="font-semibold mb-2">what you will get</p>
                <ul className="space-y-2 text-left mx-auto max-w-xs">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✔</span> 10 Fast requests and 50 Slow requests of Premium models / month
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✔</span> 1000 Requests of Advanced models / month
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✔</span> 5000 Autocomplete / month
                  </li>
                </ul>
              </div>
            </div>

            {/* Pro Plan Card */}
            <div className="bg-gradient-to-br from-purple-700 to-pink-700 p-8 rounded-lg shadow-xl border border-purple-600 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                HOT
              </div>
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <p className="text-4xl font-bold mb-2">$3</p>
              <p className="text-gray-200 mb-6">
                $10 from the second month, billed monthly
              </p>
              <button className="w-full bg-white text-black py-3 rounded-md hover:bg-gray-200 transition font-semibold text-lg">
                Get started
              </button>
              <div className="mt-6 text-gray-200 text-sm">
                <p className="font-semibold mb-2">what you will get</p>
                <ul className="space-y-2 text-left mx-auto max-w-xs">
                  <li className="flex items-center">
                    <span className="text-green-300 mr-2">✔</span> 600 Fast requests and unlimited Slow requests of Premium models / month
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-300 mr-2">✔</span> Unlimited requests of Advanced models
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-300 mr-2">✔</span> Unlimited Autocomplete
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <div className="mb-4 md:mb-0 flex items-center">
            <img src={Logo} alt="VB2 Logo" className="w-6 h-6 mr-2" />
            <span>VibeBuilder</span>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end space-x-6">
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Cookie Policy</a>
            <a href="#" className="hover:text-white transition">Feedback</a>
            <a href="#" className="hover:text-white transition">Docs</a>
            <a href="#" className="hover:text-white transition">Discord</a>
            <a href="#" className="hover:text-white transition">Twitter</a>
          </div>

          <div className="mt-4 md:mt-0">
            <span>&copy; 2025 VibeBuilder. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
