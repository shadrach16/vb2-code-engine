import React, { useState, useEffect } from 'react';
import { X, Key, Save, SkipForward } from 'lucide-react';

const LOCAL_STORAGE_KEY_GEMINI_API = 'geminiApiKey'; // Specific key for Gemini API
const LOCAL_STORAGE_KEY_USE_DEFAULT = 'useDefaultApi'; // Flag if user chose default
const API_KEYRELOAD = 'API_KEYRELOAD'; // Flag if user chose default

const GeminiApiKeyModal = ({ onApiKeySaved=e=>e, onUseDefaultApi= e=>e,show=false }) => {
  const [showModal, setShowModal] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedApiKey = localStorage.getItem(LOCAL_STORAGE_KEY_GEMINI_API);
    const useDefaultFlag = localStorage.getItem(LOCAL_STORAGE_KEY_USE_DEFAULT);
    const key_reload = localStorage.getItem(API_KEYRELOAD);

    // If an API key is already saved, or if the user explicitly chose to use default,
    // then we don't show the modal and notify the parent component immediately.
    if (storedApiKey && !key_reload) {
      onApiKeySaved(storedApiKey);
      setShowModal(false); // Ensure modal is not shown
    } else if (useDefaultFlag === 'true'  && !key_reload) {
      onUseDefaultApi();
      setShowModal(false); // Ensure modal is not shown
    } else {
      // If neither is found, show the modal
      setShowModal(true);
    }
  }, []); // Dependencies ensure this effect re-runs if these props change

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem(LOCAL_STORAGE_KEY_GEMINI_API, apiKey.trim());
      // If user saves a key, remove the 'use default' flag
      localStorage.removeItem(LOCAL_STORAGE_KEY_USE_DEFAULT);
      localStorage.removeItem(API_KEYRELOAD);
      setShowModal(false);
      onApiKeySaved(apiKey.trim()); // Notify parent
      setError('');
    } else {
      setError('API Key cannot be empty.');
    }
  };

  const handleUseDefault = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY_USE_DEFAULT, 'true');
    // If user chooses default, remove any saved custom key
    localStorage.removeItem(LOCAL_STORAGE_KEY_GEMINI_API);
    localStorage.removeItem(API_KEYRELOAD);
    setShowModal(false);
    onUseDefaultApi(); // Notify parent
    setError('');
  };

  const handleSkip = () => {
 localStorage.removeItem(API_KEYRELOAD);
    setShowModal(false);
    onUseDefaultApi(); // Treat skipping as using default for the current session
    setError('');
    
  };


  if (!showModal) return null; // Only render the modal if showModal is true

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm" style={{zIndex:9999999}}>
      <div className="relative w-full max-w-lg rounded-xl bg-gray-800 p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleSkip} // Use skip behavior for close button
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-200"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Modal Header */}
        <div className="mb-6 flex items-center justify-center">
          <Key className="mr-3 text-emerald-400" size={32} />
          <h2 className="text-3xl font-bold text-white">Gemini API Key</h2>
        </div>

        {/* Modal Body */}
        <p className="mb-6 text-center text-gray-300">
          Enhance your experience with your own Gemini API Key!
          <br />
          (You can always change this in settings later.)
        </p>

        <div className="mb-4">
          <label htmlFor="apiKeyInput" className="mb-2 block text-sm font-medium text-gray-400">
            Your Gemini API Key:
          </label>
          <input
            id="apiKeyInput"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full rounded-md border border-gray-700 bg-gray-900 px-4 py-2 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
          />
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>

        {/* Modal Actions */}
        <div className="mt-8 flex flex-col space-y-4">
          <button
            onClick={handleSave}
            className="flex w-full items-center justify-center rounded-md bg-emerald-600  border border-emerald-500  px-4 py-3 font-semibold text-white transition duration-200 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <Save size={20} className="mr-2" /> Save Key
          </button>

          <button
            onClick={handleUseDefault}
            className="flex w-full items-center justify-center rounded-md border border-emerald-500 px-4 py-3 font-semibold text-emerald-300 transition duration-200 hover:bg-emerald-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Use Platform Default API
          </button>

          <button
            onClick={handleSkip}
            className="flex w-full items-center justify-center rounded-md px-4 py-3 font-semibold text-gray-400 transition duration-200 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <SkipForward size={20} className="mr-2" /> Skip for Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiApiKeyModal;