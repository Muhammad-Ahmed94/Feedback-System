import { Link } from "react-router-dom"
import Button from "./Button"
import useUserStore from "../stores/useUserStore"

const Navbar = () => {
  const { user, logout } = useUserStore();
  
  return (
    <div className="flex justify-between items-center mb-4 p-4 bg-white shadow-sm rounded-lg">
      <div>
        <Link to="/">
          <Button title="Home" styles="bg-blue-400 hover:bg-blue-500 transition-colors" />
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        {!user ? (
          <div className="text-gray-600">
            Let's get started
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {/* Anonymous Identity Display */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-lg border border-blue-200">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.anonymousName?.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">
                  {user.anonymousName}
                </span>
                <span className="text-xs text-gray-500">
                  {user.anonymousId}
                </span>
              </div>
              
              {/* Verification Badge */}
              {user.isEmailVerified && (
                <div className="ml-2" title="Email Verified">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Logout Button */}
            <button 
              onClick={logout}
              className="px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar