import { Modal } from "@mantine/core";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const RequireLogin = ({ open, close }) => {
  const navigate = useNavigate();
  return (
    <Modal
      opened={open}
      onClose={close}
      title={
        <h2 className="text-lg font-semibold text-gray-800">
          Yêu cầu đăng nhập
        </h2>
      }
      centered
      overlayProps={{
        blur: 3,
        backgroundOpacity: 0.55,
      }}
      radius="md"
      size="md"
      padding="lg"
    >
      <div className="space-y-4 text-center space-x-4">
        <p className="text-black text-md">
          Vui lòng đăng nhập để sử dụng tính năng này. Tài khoản của bạn giúp
          chúng tôi bảo vệ thông tin và cá nhân hoá trải nghiệm.
        </p>
        <button
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium rounded-md px-6 py-2 shadow-md"
          onClick={() => navigate("/login")}
        >
          Đăng nhập ngay
        </button>
        <button
          className="bg-gray-600 hover:bg-gray-700 transition-colors text-white font-medium rounded-md px-6 py-2 shadow-md"
          onClick={close}
        >
          Hủy
        </button>
      </div>
    </Modal>
  );
};

RequireLogin.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default RequireLogin;
