// src/components/ComingSoon.jsx
import React from 'react';
import { Sparkles, Hourglass } from 'lucide-react'; // Assuming you have lucide-react installed
import './ComingSoon.css'; // This CSS file will be updated for dark design

const ComingSoon = ({
  featureName = 'This feature',
  message = 'We are working hard to bring you something amazing!',
  showIcon = true,
  iconType = 'sparkles', // Can be 'sparkles' or 'hourglass'
}) => {
  const IconComponent = iconType === 'hourglass' ? Hourglass : Sparkles;

  return (
    <div className="coming-soon-container">
      {showIcon && (
        <div className="coming-soon-icon">
          {/* Icons often look good with a subtle bright color on dark backgrounds */}
          <IconComponent size={64} color="#61DAFB" /> {/* React Blue/Cyan for icon */}
        </div>
      )}
      <h2 className="coming-soon-title">
        {featureName} is Coming Soon!
      </h2>
      <p className="coming-soon-message">
        {message}
      </p>
      <div className="coming-soon-gradient-bar"></div>
    </div>
  );
};

export default ComingSoon;