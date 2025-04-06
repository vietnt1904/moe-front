import { UserIcon } from "lucide-react";
import { LockIcon } from "lucide-react"; // Keep if using for password visibility
import { useState, useEffect } from "react"; // Added useEffect
import { Link } from "react-router-dom";

const backgroundImageUrl = "/images/background.jpg"; // Ensure this path is correct in your project
const googleLogoUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png";

// Assuming lock icon image is needed if not using LockIcon for confirm password
// const lockImageUrl = '/images/khoa.png'; // Make sure path is correct

const SignUpPage = () => {
  // --- State ---
  const [name, setName] = useState(""); // Added
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Added
  const [sendNotification, setSendNotification] = useState(false); // Renamed from rememberMe
  const [passwordsMatch, setPasswordsMatch] = useState(true); // Added
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  // --- Password Matching Effect ---
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  // --- Handle Submission ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!passwordsMatch) {
      setError("Passwords do not match!");
      return; // Prevent submission
    }

    setLoading(true);
    // Include all relevant fields for registration
    console.log("Submitting registration:", {
      name,
      email,
      password,
      sendNotification,
    });

    try {
      // Replace with your actual API call to the registration endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      // --- Placeholder Success/Error ---
      // Example: Check if email already exists (simulate error)
      if (email === "taken@example.com") {
        throw new Error("Email address is already registered.");
      }

      console.log("Registration successful (placeholder)");
      setSuccessMessage("Registration successful! Please check your email.");
      // Optionally clear the form or redirect
      // setName(''); setEmail(''); setPassword(''); setConfirmPassword(''); setSendNotification(false);
      // navigate('/login'); // Example redirect
      // --- End Placeholder ---
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  // --- Toggle Password Visibility ---
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      className="relative min-h-screen w-full bg-cover bg-no-repeat font-sans"
    >
      <div className="flex justify-end h-screen">
        <div className="relative flex w-full h-full justify-end">
          <div className="absolute left-0 top-0 bottom-0 z-10 md:flex-col items-end w-[calc(20%+16rem)] h-full hidden md:flex">
            <div className="h-[calc(50%-11rem)] w-64 rounded-br-[78px]"></div>
            <div className="w-64 h-44 flex items-center justify-center rounded-l-full font-inter italic font-extrabold text-3xl leading-10 text-white">
              <Link
                to={"/login"}
                className="flex items-center justify-center rounded-l-full text-white font-inter italic font-extrabold text-3xl leading-10 no-underline"
              >
                Đăng nhập
              </Link>
            </div>

            <div className="w-64 h-44 flex items-center justify-center rounded-l-full font-inter italic font-extrabold text-3xl leading-10 backdrop-blur-lg shadow-md text-black">
              Đăng ký
            </div>
          </div>

          <div className="flex absolute right-0 top-0 bottom-0 w-full md:w-[calc(80%-16rem)] h-full rounded-l-none md:rounded-l-[78px] backdrop-blur-lg justify-center items-center p-4 md:p-8">
            <div className="w-full max-w-sm md:max-w-md">
              {error && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                  role="alert"
                >
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                  <button
                    onClick={() => setError(null)}
                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  >
                    <svg
                      className="fill-current h-6 w-6 text-red-500"
                      role="button"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <title>Close</title>
                      <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                    </svg>
                  </button>
                </div>
              )}
              {/* Success Message Display */}
              {successMessage && (
                <div
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
                  role="alert"
                >
                  <strong className="font-bold">Success: </strong>
                  <span className="block sm:inline">{successMessage}</span>
                  <button
                    onClick={() => setSuccessMessage(null)}
                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  >
                    <svg
                      className="fill-current h-6 w-6 text-green-500"
                      role="button"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <title>Close</title>
                      <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="w-full">
                {/* Welcome Text */}
                <div className="mb-3 text-center">
                  <h2 className="text-2xl text-white py-2">
                    Chào mừng
                    {/* Removed link from "bạn mới" */}
                    <span className="text-blue-400 px-1">bạn mới</span>!
                  </h2>
                  <p className="text-sm text-gray-300 py-1">
                    Mỗi trang truyện là một phiêu lưu mới
                  </p>
                </div>

                {/* Name Input */}
                <div className="relative mb-4">
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full h-12 px-4 pr-10 rounded-lg border-2 border-gray-400 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Name"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    <UserIcon className="w-6 h-6" />
                  </span>
                </div>

                {/* Email Input */}
                <div className="relative mb-4">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 px-4 pr-10 rounded-lg border-2 border-gray-400 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">
                    @
                  </span>
                </div>

                {/* Password Input */}
                <div className="relative mb-4">
                  <input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-12 pl-4 pr-10 rounded-lg border-2 border-gray-400 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Password"
                  />
                  {/* Using LockIcon for visibility toggle */}
                  <LockIcon
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer h-5 w-5" // Added size and cursor
                  />
                </div>

                {/* Confirm Password Input */}
                <div className="relative mb-1">
                  {" "}
                  {/* Reduced bottom margin */}
                  <input
                    id="confirmpassword"
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    name="confirmpassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`w-full h-12 pl-4 pr-10 rounded-lg border-2 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
                      !passwordsMatch && confirmPassword // Show red border only if typed & not matching
                        ? "border-red-500 ring-red-500"
                        : "border-gray-400 focus:ring-blue-500"
                    }`}
                    placeholder="Confirm password"
                  />
                  <LockIcon
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5"
                  />
                </div>

                {/* Password Mismatch Message */}
                {!passwordsMatch &&
                  confirmPassword && ( // Only show if typed and not matching
                    <p className="text-red-500 text-xs text-center mt-1 mb-2">
                      Mật khẩu nhắc lại chưa đúng!
                    </p>
                  )}

                {/* Checkbox */}
                <div className="flex justify-start items-center my-4 text-sm">
                  {" "}
                  {/* Adjusted margin */}
                  <label className="flex items-center text-gray-200 cursor-pointer">
                    <input
                      type="checkbox"
                      name="sendNotification"
                      checked={sendNotification}
                      onChange={(e) => setSendNotification(e.target.checked)}
                      className="size-4 mr-2 rounded border-gray-300 text-blue-500 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    Send notification to my email
                  </label>
                  {/* Removed recovery password link */}
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={loading || !passwordsMatch} // Disable if loading or passwords don't match
                  className={`w-full h-12 rounded-lg border-solid border-gray-700 border-2 my-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold flex items-center justify-center transition duration-150 ease-in-out ${
                    loading || !passwordsMatch
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {loading ? (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  ) : (
                    "Sign up" // Changed text
                  )}
                </button>

                {/* Google Sign Up Button */}
                <button
                  type="button"
                  onClick={() => {
                    console.log(
                      "Google sign-up clicked"
                    ); /* Add Google Sign Up Logic */
                  }}
                  className="w-full h-12 rounded-lg border-solid border-gray-400 border-2 my-3 bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center transition duration-150 ease-in-out"
                >
                  <img
                    src={googleLogoUrl}
                    alt="Google logo"
                    className="h-5 w-5"
                  />
                  <span className="pl-3 font-medium">Sign up with Google</span>{" "}
                  {/* Changed text */}
                </button>

                {/* Bottom Links */}
                <div className="text-center mt-4 text-sm">
                  <p className="text-gray-300 py-1">
                    Already have an account?
                    <Link // Changed to Link
                      to="/login" // Link to login page
                      className="text-blue-300 hover:text-blue-100 pl-1 hover:underline"
                    >
                      Log in
                    </Link>
                  </p>
                  <p className="text-gray-300 py-1">
                    Go back to
                    <Link // Changed to Link
                      to="/" // Link to home page
                      className="text-blue-300 hover:text-blue-100 pl-1 hover:underline"
                    >
                      home page
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
