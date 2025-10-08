import useUserStore from '../stores/useUserStore';

const Feedbackpage = () => {
  const { user } = useUserStore();

  return (
    <div className='w-full min-h-screen flex-col-center p-8'>
      <div className='max-w-4xl w-full'>
        {/* User Identity Banner */}
        <div className='bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-8 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm opacity-90 mb-1'>You are logged in as</p>
              <h2 className='text-3xl font-bold'>{user?.anonymousName}</h2>
              <p className='text-sm opacity-75 mt-2'>ID: {user?.anonymousId}</p>
            </div>
            <div className='bg-white bg-opacity-20 rounded-full p-4'>
              <svg className='w-12 h-12' fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          </div>
          <div className='mt-4 bg-white bg-opacity-10 rounded p-3'>
            <p className='text-xs'>
              🔒 Your identity is completely anonymized. All feedback submitted will be associated with your anonymous identity only.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className='bg-white rounded-lg shadow-lg p-8'>
          <h1 className='text-4xl font-bold mb-4 text-gray-800'>Feedback System</h1>
          <p className='text-gray-600 mb-6'>
            Welcome to the Smart Insight feedback system. Your feedback helps improve our organization.
          </p>

          {/* Verification Status */}
          <div className='bg-green-50 border-l-4 border-green-500 p-4 mb-6'>
            <div className='flex items-center'>
              <svg className='w-5 h-5 text-green-500 mr-2' fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className='text-sm font-medium text-green-800'>Email Verified</p>
                <p className='text-xs text-green-700'>You have full access to the feedback system</p>
              </div>
            </div>
          </div>

          {/* Anonymization Info */}
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8'>
            <h3 className='font-semibold text-blue-900 mb-3 flex items-center'>
              <svg className='w-5 h-5 mr-2' fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              How Anonymization Works
            </h3>
            <ul className='text-sm text-blue-800 space-y-2'>
              <li>✓ Your real email is encrypted and cannot be recovered from the system</li>
              <li>✓ Your password is hashed using industry-standard bcrypt</li>
              <li>✓ All feedback is linked to your anonymous ID, not your real identity</li>
              <li>✓ Your anonymous name is randomly generated and unique</li>
              <li>✓ Even administrators cannot trace feedback back to your real identity</li>
            </ul>
          </div>

          {/* Feedback Form Placeholder */}
          <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center'>
            <svg className='w-16 h-16 mx-auto text-gray-400 mb-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>Feedback Form Coming Soon</h3>
            <p className='text-gray-500'>
              The feedback submission form will be implemented here. All submissions will be associated with your anonymous identity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedbackpage;