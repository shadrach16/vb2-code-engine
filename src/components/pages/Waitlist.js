import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Using framer-motion for animations

// WaitlistPage component for users to sign up for early access with a modern Vercel-like design
const WaitlistPage = () => {
  // State to hold the email input value
  const [email, setEmail] = useState('');
  // State to hold any error messages
  const [error, setError] = useState(null);
  // State to show a success message after opening the mail client
  const [actionMessage, setActionMessage] = useState(null);
  // State to control the initial card animation
  const [showCard, setShowCard] = useState(false);

  // Effect to trigger the initial card animation on mount
  useEffect(() => {
    setShowCard(true);
  }, []);

  // Function to handle changes in the email input field
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    // Clear previous error and action messages on input change
    setError(null);
    setActionMessage(null);
  };

  // Function to validate the email format
  const validateEmail = (email) => {
    // Simple regex for basic email format validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Function to handle the button click - opens mail client
  const handleMailtoClick = (event) => {
    event.preventDefault(); // Prevent default button behavior

    // Basic validation before attempting mailto
    if (!email) {
      setError('Email address is required to join the waitlist.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null); // Clear previous errors

    // Construct the mailto link
    const recipient = 'tunde.oluwamo@adroitsolutions.com';
    const subject = encodeURIComponent('Waitlist Request');
    const body = encodeURIComponent(`I would like to join the waitlist for early access.\nMy email is: ${email}\n\n[Optional: Add any other message here]`);

    const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;

    // Attempt to open the user's email client
    window.location.href = mailtoLink;

    // Set a message instructing the user to send the email
    setActionMessage('Please send the email that just opened in your mail client to join the waitlist.');

    // Note: We cannot reliably detect if the user actually sent the email
    // using this client-side mailto approach.
  };

  // Animation variants for the main card
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Animation variants for messages (error/action)
  const messageVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    // Container for the waitlist page with modern styling and subtle background animation
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-4 overflow-hidden relative">
       {/* Subtle background gradient animation */}
       <div className="absolute inset-0 z-0 animate-gradient-pulse opacity-20"></div>

      {/* Main content card with animation */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700 relative z-10"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="hidden" // Use exit for AnimatePresence
          >
            {/* Waitlist title and description */}
            <h2 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
              Join the Future. Early Access Awaits.
            </h2>
            <p className="text-gray-300 text-center mb-6 text-lg">
              We're currently in the exciting **prototype phase** of our program. If you love what you see and want to be among the first to experience the full version, join our exclusive waitlist!
            </p>
             <p className="text-gray-400 text-center mb-6 text-sm">
              By joining, you'll get early access and updates as we move towards launch. Don't miss out!
            </p>


            {/* Waitlist form - Note: Using a form still for structure, but button triggers mailto */}
            <form style={{background:'transparent'}} onSubmit={(e) => e.preventDefault()}> {/* Prevent form default submission */}
              <div className="mb-6"> {/* Increased bottom margin */}
                <label htmlFor="email" className="block text-gray-300 text-sm font-semibold mb-2">
                  Your Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className={`w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
                {/* Display validation error with animation */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      className="text-red-400 text-xs italic mt-2"
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Button to trigger mailto link */}
              <div className="flex items-center justify-center">
                <button
                  type="button" // Changed to type="button"
                  onClick={handleMailtoClick} // Added onClick handler
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out transform hover:scale-105"
                   // Disabled state based on email validation
                  disabled={!email || !validateEmail(email)}
                >
                  Join Waitlist
                </button>
              </div>
            </form>

            {/* Display action message */}
            <AnimatePresence>
              {actionMessage && (
                <motion.p
                  className="text-green-400 text-center text-sm mt-6 font-semibold"
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {actionMessage}
                </motion.p>
              )}
            </AnimatePresence>

             <p className="text-gray-500 text-center text-xs mt-4">
                (Note: This will open your default email application.)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WaitlistPage;
