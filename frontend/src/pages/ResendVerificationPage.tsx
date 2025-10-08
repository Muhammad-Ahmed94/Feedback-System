import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInst from '../lib/axios';
import FormField from '../components/FormField';

const ResendVerificationPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosInst.post('/auth/resend-verification', { email });
      toast.success(res.data.message);
      setSent(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="w-full min-h-screen flex-col-center">
        <div className="max-w-md w-full mx-auto px-4 text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold">Check Your Email</h2>
          <p className="text-gray-600">
            We've sent a verification email to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Click the link in the email to verify your account. The link will expire in 24 hours.
          </p>
          <Link to="/login" className="inline-block px-6 py-3 bg-blue-400 hover:bg-blue-500 rounded mt-4">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen shadow-2xl text-xl relative text-center py-8 flex-col-center">
      <div className="max-w-md w-full mx-auto px-4">
        <h2 className="font-semibold text-2xl mb-6">Resend Verification Email</h2>

        <div className="border border-gray-300 flex flex-col align-center rounded py-6 px-4 bg-white">
          <p className="text-gray-600 mb-4">
            Enter your email address and we'll send you a new verification link
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            <FormField
              title="Email Address"
              type="email"
              placeholder="example@kfueit.edu.pk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-400 hover:bg-opacity-90 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Verification Email'}
              </button>
            </div>
          </form>

          <div className="text-gray-500 w-full mt-6 text-center">
            <p className="flex items-center justify-center gap-1">
              Remember your password?
              <Link to="/login" className="underline flex items-center gap-1 hover:no-underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResendVerificationPage;