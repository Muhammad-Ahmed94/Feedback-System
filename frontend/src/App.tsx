import { Navigate, Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import SignupPage from './pages/SignupPage'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import { Toaster } from 'react-hot-toast'
import useUserStore from './stores/useUserStore'
import { useEffect } from 'react'
import Feedbackpage from './pages/Feedbackpage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ResendVerificationPage from './pages/ResendVerificationPage'


const App = () => {
  const { user, checkingAuth, checkAuth} = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="text-font-main text-xl">Loading...</div>
    </div>
  )
 }

  return (
    <div className="p-4 min-h-screen overflow-hidden">
      <Navbar />
      <Routes>
        <Route path='/' element={<Homepage />} />

        <Route path='/signup' element={!user ? <SignupPage /> : <Navigate to="/feedback" replace />} />

        <Route path='/login' element={!user ? <LoginPage /> : <Navigate to="/feedback" replace />} />

        <Route path='/verify-email' element={<VerifyEmailPage />} />

        <Route path='/resend-verification' element={<ResendVerificationPage />} />

        {/* Protected route - requires authentication and email verification */}
        <Route 
          path='/feedback' 
          element={
            user ? (
              user.isEmailVerified ? (
                <Feedbackpage />
              ) : (
                <EmailVerificationRequired />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
      <Toaster />
    </div>
  )
}

// Component shown when user is logged in but email is not verified
const EmailVerificationRequired = () => {
  return (
    <div className="w-full min-h-screen flex-col-center">
      <div className="max-w-md w-full mx-auto px-4 text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold">Email Verification Required</h2>
        <p className="text-gray-600">
          Please verify your email address to access the feedback system.
        </p>
        <p className="text-sm text-gray-500">
          Check your inbox for the verification email we sent you.
        </p>
        <div className="space-y-2 pt-4">
          <a 
            href="/resend-verification" 
            className="inline-block w-full px-6 py-3 bg-blue-400 hover:bg-blue-500 rounded"
          >
            Resend Verification Email
          </a>
          <p className="text-xs text-gray-500 pt-2">
            Didn't receive the email? Check your spam folder or click above to resend.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App