// src/auth/components/VerifyAccount.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const VerifyAccount = () => {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState('verifying');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(/verify-account/${token}, { // Replace with your actual verification endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setVerificationStatus('success');
        } else {
          setVerificationStatus('error');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
      }
    };

    verifyToken();
  }, [token]);

  let content;
  switch (verificationStatus) {
    case 'verifying':
      content = <p>Verifying your account...</p>;
      break;
    case 'success':
      content = <p>Your account has been successfully verified!</p>;
      break;
    case 'error':
      content = <p>Failed to verify your account. Please try again or contact support.</p>;
      break;
    default:
      content = <p>Something went wrong.</p>;
  }

  return (
    <div>
      <h2>Account Verification</h2>
      {content}
    </div>
  );
};

export default VerifyAccount;