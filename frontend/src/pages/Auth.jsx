import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

function Auth() {
  const location = useLocation()
  const [isLoginMode, setIsLoginMode] = useState(location.pathname === '/login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Update mode when route changes
  useEffect(() => {
    setIsLoginMode(location.pathname === '/login')
  }, [location.pathname])

  // Toggle between login and register modes
  const toggleMode = () => {
    navigate(isLoginMode ? '/register' : '/login')
  }

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {}

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
    }

    // Confirm password validation (only in register mode)
    if (!isLoginMode) {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (confirmPassword !== password) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      // For demo purposes, just navigate to home
      navigate('/')

      // In a real app, you'd handle authentication here:
      // if (isLoginMode) {
      //   loginUser(email, password)
      // } else {
      //   registerUser(email, password)
      // }
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="bg-[#121212] rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#1a1a1a] px-6 py-4 border-b border-[#2a2a2a]">
          <h1 className="text-xl font-bold text-white">
            {isLoginMode ? 'Log In to Webflix' : 'Create an Account'}
          </h1>
        </div>

        <div className="p-6">
          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-[#1e1e1e] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5ccfee] ${
                  errors.email ? 'border border-red-500' : ''
                }`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-[#1e1e1e] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5ccfee] ${
                  errors.password ? 'border border-red-500' : ''
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field (Registration only) */}
            {!isLoginMode && (
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full bg-[#1e1e1e] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5ccfee] ${
                    errors.confirmPassword ? 'border border-red-500' : ''
                  }`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#5ccfee] hover:bg-[#4ab3d3] text-black font-semibold py-3 rounded-md transition-colors mt-2 flex items-center justify-center"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : isLoginMode ? (
                'Log In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Mode Toggle Link */}
          <div className="mt-4 text-center">
            <button
              onClick={toggleMode}
              className="text-[#5ccfee] hover:text-[#4ab3d3] text-sm transition-colors"
            >
              {isLoginMode
                ? "Don't have an account? Register here"
                : 'Already have an account? Log in'}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-[#2a2a2a]"></div>
            <span className="px-3 text-sm text-gray-400">OR</span>
            <div className="flex-grow h-px bg-[#2a2a2a]"></div>
          </div>

          {/* Social Login Buttons */}
          <button
            disabled
            className="w-full bg-[#1e1e1e] border border-[#2a2a2a] text-white font-medium py-2.5 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-[#2a2a2a] transition-colors opacity-70 cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <path
                fill="#fff"
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Forgot Password (Login only) */}
          {isLoginMode && (
            <div className="mt-4 text-center">
              <Link
                to="/forgot-password"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Auth
