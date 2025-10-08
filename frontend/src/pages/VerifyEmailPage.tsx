import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInst from '../lib/axios';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setError('Invalid verification link');
      setVerifying(false);
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const res = await axiosInst.get(`/auth/verify-email?token=${token}`);
      setVerified(true);
      toast.success(res.data.message);
      
      // Redirect to login or feedback page after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Verification failed');
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex-col-center">
      <div className="max-w-md w-full mx-auto px-4 text-center">
        {verifying && (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto"></div>
            <h2 className="text-2xl font-semibold">Verifying your email...</h2>
            <p className="text-gray-600">Please wait while we verify your email address.</p>
          </div>
        )}

        {!verifying && verified && (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-green-600">Email Verified!</h2>
            <p className="text-gray-600">
              Your email has been verified successfully. You can now access the feedback system.
            </p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </div>
        )}

        {!verifying && error && (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-red-600">Verification Failed</h2>
            <p className="text-gray-600">{error}</p>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/resend-verification')}
                className="w-full px-6 py-3 bg-blue-400 hover:bg-blue-500 rounded"
              >
                Request New Verification Email
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;