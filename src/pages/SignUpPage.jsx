import { UserIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthService from "../services/AuthService";
import { Button, Card, Modal, Text, TextInput, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

const backgroundImageUrl = "/images/background.jpg";
const googleLogoUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png";

const SignUpPage = () => {
  const {
    register,
    handleSubmit: handleRHFSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      sendNotification: false,
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [OTP, setOTP] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [OTPError, setOTPError] = useState(null);
  const navigate = useNavigate();

  const passwordValue = watch("password");

  const handleSignUp = async (data) => {
    setIsLoading(true);
    setEmail(data?.email);
    const { data: dataOutput } = await AuthService.signup(data);
    setIsLoading(false);
    if (dataOutput?.success) {
      open();
    } else {
      notifications.show({
        color: "red",
        title: "Lỗi đăng ký",
        message: dataOutput?.message,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const getInputClass = (fieldName) => {
    return `w-full h-12 px-4 pr-10 rounded-lg border-2 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent ${
      errors[fieldName]
        ? "border-red-500 ring-red-500"
        : "border-gray-400 focus:ring-blue-500"
    }`;
  };

  const [opened, { open, close }] = useDisclosure(false);

  const handleSignUpData = async (data) => {
    const otp = OTP;
    setOTP("");
    if (!otp) {
      setOTPError("Vui lòng nhập OTP");
      return;
    }
    if (otp.length !== 6) {
      setOTPError("OTP chỉ có 6 ký tự");
      return;
    }
    setIsLoading(true);
    const { data: verifyOTP } = await AuthService.verifyOTP(email, otp);
    if (verifyOTP?.success) {
      const { data: dataOutput } = await AuthService.signupData(data);
      if (dataOutput?.success) {
        setIsLoading(false);
        reset();
        close();
        notifications.show({
          color: "green",
          title: "Đăng ký thành công",
          message: "Đang chuyển hướng tới trang đăng nhập",
        });
        navigate("/login");
      } else {
        notifications.show({
          color: "red",
          title: "Lỗi khi đăng ký",
          message: verifyOTP?.message,
        });
      }
    } else {
      setOTPError(verifyOTP?.message);
    }
    setIsLoading(false);
  };

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      className="relative min-h-screen w-full bg-cover bg-no-repeat font-sans"
    >
      <div className="flex justify-end h-screen">
        <div className="relative flex w-full h-full justify-end">
          {/* Sidebar */}
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

          {/* Form Container */}
          <div className="flex absolute right-0 top-0 bottom-0 w-full md:w-[calc(80%-16rem)] h-full rounded-l-none md:rounded-l-[78px] backdrop-blur-lg justify-center items-center p-4 md:p-8 overflow-y-auto">
            <div className="w-full max-w-sm md:max-w-md">
              <form onSubmit={handleRHFSubmit(handleSignUp)} className="w-full">
                <div className="mb-3 text-center">
                  <h2 className="text-2xl text-white py-2">
                    Chào mừng
                    <span className="text-blue-400 px-1">bạn mới</span>!
                  </h2>
                  <p className="text-sm text-gray-300 py-1">
                    Mỗi trang truyện là một phiêu lưu mới
                  </p>
                </div>

                <div className="relative mb-1 mt-4">
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Full Name"
                    className={getInputClass("fullName")}
                    aria-invalid={errors.fullName ? "true" : "false"}
                    {...register("fullName", {
                      required: "Full Name is required",
                    })}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <UserIcon className="w-5 h-5" />
                  </span>
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1 mb-2 text-left">
                    {errors.fullName.message}
                  </p>
                )}

                <div className="relative mb-1 mt-4">
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    className={getInputClass("email")}
                    aria-invalid={errors.email ? "true" : "false"}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">
                    @
                  </span>
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 mb-2 text-left">
                    {errors.email.message}
                  </p>
                )}

                <div className="relative mb-1 mt-4">
                  <input
                    id="username"
                    type="text"
                    placeholder="Username"
                    className={getInputClass("username")}
                    aria-invalid={errors.username ? "true" : "false"}
                    {...register("username", {
                      required: "Username is required",
                    })}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <UserIcon className="w-5 h-5" />
                  </span>
                </div>
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1 mb-2 text-left">
                    {errors.username.message}
                  </p>
                )}

                <div className="relative mb-1 mt-4">
                  <input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Password"
                    className={getInputClass("password")}
                    aria-invalid={errors.password ? "true" : "false"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    aria-label={
                      isPasswordVisible ? "Hide password" : "Show password"
                    }
                  >
                    {isPasswordVisible ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 mb-2 text-left">
                    {errors.password.message}
                  </p>
                )}

                <div className="relative mb-1 mt-4">
                  <input
                    id="confirmPassword"
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    placeholder="Confirm password"
                    className={getInputClass("confirmPassword")}
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === passwordValue || "Passwords do not match!",
                    })}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    aria-label={
                      isConfirmPasswordVisible
                        ? "Hide confirmation password"
                        : "Show confirmation password"
                    }
                  >
                    {isConfirmPasswordVisible ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 mb-2 text-left">
                    {errors.confirmPassword.message}
                  </p>
                )}

                <div className="flex justify-start items-center my-4 text-sm">
                  <label className="flex items-center text-gray-200 cursor-pointer">
                    <input
                      type="checkbox"
                      id="sendNotification"
                      {...register("sendNotification")}
                      className="size-4 mr-2 rounded border-gray-300 text-blue-500 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    Send notification to my email
                  </label>
                </div>

                <Button
                  size="md"
                  fullWidth
                  loading={isLoading}
                  type="submit"
                  disabled={isLoading}
                  className={
                    "my-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                  }
                >
                  Sign Up
                </Button>

                {/* Google Sign Up Button */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  className={`w-full h-12 rounded-lg border-solid border-gray-400 border-2 my-3 bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center transition duration-150 ease-in-out ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <img
                    src={googleLogoUrl}
                    alt="Google logo"
                    className="h-5 w-5"
                  />
                  <span className="pl-3 font-medium">Sign up with Google</span>
                </button>

                <div className="text-center mt-4 text-sm">
                  <p className="text-gray-300 py-1">
                    Already have an account?
                    <Link
                      to="/login"
                      className="text-blue-300 hover:text-blue-100 pl-1 hover:underline"
                    >
                      Log in
                    </Link>
                  </p>
                  <p className="text-gray-300 py-1">
                    Go back to
                    <Link
                      to="/"
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
      <Modal
        opened={opened}
        onClose={() => {}}
        centered
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
      >
        <Card shadow="md" padding="lg" className="w-full max-w-md">
          <Title order={3} mb="md">
            Nhập mã OTP
          </Title>
          <Text>
            Hãy kiểm tra thư mục spam trong email của bạn nếu không thấy thông
            báo.
          </Text>
          <TextInput
            label="Mã OTP"
            placeholder="123456"
            value={OTP}
            onChange={(e) => {
              setOTP(e.target.value);
            }}
            maxLength={6}
          />
          <p className="text-red-500 text-xs">{OTPError}</p>
          <Button
            loading={isLoading}
            disabled={isLoading}
            onClick={handleRHFSubmit(handleSignUpData)}
            className="mt-4"
          >
            Kiểm tra
          </Button>
          <Button
            onClick={() => {
              setOTPError("");
              close();
            }}
            disabled={isLoading}
            variant="light"
            className="mt-4"
          >
            Quay lại
          </Button>
        </Card>
      </Modal>
    </div>
  );
};

export default SignUpPage;
