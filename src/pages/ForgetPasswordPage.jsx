import { Button, Card, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const backgroundImageUrl = "/images/background.jpg";

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : "Email không hợp lệ",
    },
  });

  const newPasswordForm = useForm({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: {
      password: (value) =>
        value.length >= 6 ? null : "Mật khẩu phải ít nhất 6 ký tự",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Nhắc lại mật khẩu chưa đúng",
    },
  });

  const [isSendMail, setIsSendMail] = useState(false);
  const [isOTPRight, setIsOTPRight] = useState(false);
  const [email, setEmail] = useState("");
  const [hashOTP, setHashOTP] = useState("");
  const [OTP, setOTP] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmitEmail = async (values) => {
    setSuccessMessage(null);
    setIsLoading(true);
    setEmail(values.email);

    try {
      const { data: dataOutput } = await AuthService.forgetPassword(
        values.email
      );
      setHashOTP(dataOutput?.data);
      setIsSendMail(true);

      setSuccessMessage("Registration successful! Redirecting...");

      setTimeout(() => {
        setSuccessMessage(null);
        // navigate('/');
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOTP = async () => {
    const { data: verifyOTP } = await AuthService.verifyOTP(email, OTP);
    if (verifyOTP?.success) {
      setIsOTPRight(true);
    } else {
      // console.log("Loi", verifyOTP?.message);
    }
  };

  const handleSubmitNewPassword = async (values) => {
    setIsLoading(true);
    try {
      const { data: dataOutput } = await AuthService.resetPassword(
        email,
        values.password
      );
      setSuccessMessage("Registration successful! Redirecting...");
      setTimeout(() => {
        setSuccessMessage(null);
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      className="relative min-h-screen w-full bg-cover bg-no-repeat font-sans"
    >
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
            aria-label="Close"
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
      <div>
        <div className="flex justify-center items-center min-h-screen">
          {!isSendMail ? (
            <Card shadow="md" padding="lg" className="w-full max-w-md">
              <Title order={3} mb="md">
                Quên mật khẩu
              </Title>
              <Text mb="sm">
                Nhập email đã đăng ký để nhận liên kết khôi phục:
              </Text>

              <form onSubmit={form.onSubmit(handleSubmitEmail)}>
                <TextInput
                  label="Email"
                  placeholder="you@example.com"
                  {...form.getInputProps("email")}
                />

                <Button
                  loading={isLoading}
                  disabled={isLoading}
                  type="submit"
                  fullWidth
                  mt="md"
                >
                  Gửi yêu cầu
                </Button>
              </form>
            </Card>
          ) : !isOTPRight ? (
            <Card shadow="md" padding="lg" className="w-full max-w-md">
              <Title order={3} mb="md">
                Nhập mã OTP
              </Title>
              <Text>
                Hãy kiểm tra thư mục spam trong email của bạn nếu không thấy
                thông báo.
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
              <Button
                loading={isLoading}
                disabled={isLoading}
                onClick={handleCheckOTP}
                className="mt-4"
              >
                Kiểm tra
              </Button>
            </Card>
          ) : (
            <Card shadow="md" padding="lg" className="w-full max-w-md">
              <Title order={3} mb="md">
                Nhập mật khẩu mới
              </Title>

              <form
                onSubmit={newPasswordForm.onSubmit(handleSubmitNewPassword)}
              >
                <TextInput
                  label="Mật khẩu mới"
                  placeholder="your new password"
                  type="password"
                  {...newPasswordForm.getInputProps("password")}
                />
                <TextInput
                  label="Nhắc lại mật khẩu mới"
                  placeholder="your new password"
                  type="password"
                  {...newPasswordForm.getInputProps("confirmPassword")}
                />

                <Button
                  loading={isLoading}
                  disabled={isLoading}
                  type="submit"
                  fullWidth
                  mt="md"
                >
                  Xác nhận
                </Button>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
