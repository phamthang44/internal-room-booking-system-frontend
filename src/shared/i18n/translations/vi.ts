// Vietnamese translations
export const vi = {
  auth: {
    login: {
      title: "Chào mừng quay trở lại",
      subtitle: "Truy cập bảng điều khiển học tập của bạn",
      email: {
        label: "Email hoặc Tên người dùng",
        placeholder: "ví dụ: j.smith@university.edu",
        error: {
          required: "Email là bắt buộc",
          invalid: "Vui lòng nhập một email hợp lệ",
        },
      },
      password: {
        label: "Mật khẩu",
        placeholder: "••••••••",
        error: {
          required: "Mật khẩu là bắt buộc",
          minLength: "Mật khẩu phải có ít nhất 8 ký tự",
        },
      },
      forgotPassword: "Quên mật khẩu?",
      submit: {
        signIn: "Đăng nhập",
        signing: "Đang đăng nhập...",
      },
      divider: "Hoặc tiếp tục với",
      oauth: {
        google: "Tiếp tục với Google",
        loading: "Đang đăng nhập bằng Google...",
        dialog: {
          title: "Đăng nhập Google thất bại",
          confirm: "Đã hiểu",
        },
        error: {
          userNotFound:
            "Tài khoản của bạn chưa được đăng ký. Vui lòng liên hệ quản trị viên.",
          invalidToken: "Xác thực Google không thành công. Vui lòng thử lại.",
          network: "Lỗi mạng. Vui lòng kiểm tra kết nối và thử lại.",
          unknown: "Đăng nhập Google không thành công. Vui lòng thử lại.",
        },
      },
      footer:
        "Quyền truy cập hạn chế cho nhân viên và sinh viên của Trường đại học.",
      errors: {
        unknown: "Đã xảy ra lỗi. Vui lòng thử lại.",
      },
    },
  },
  common: {
    appName: "Scholarly Sanctuary",
    layout: {
      leftPanel: {
        title: "Các không gian yên tĩnh cho tập trung sâu.",
        description:
          "Trải nghiệm một môi trường đặt chỗ phức tạp được thiết kế cho lối sống học tập hiện đại.",
      },
    },
    errors: {
      unknown: "Đã xảy ra lỗi. Vui lòng thử lại.",
    },
    language: "Ngôn ngữ",
    help: "Trợ giúp",
    security: "Chính sách bảo mật",
    terms: "Điều khoản dịch vụ",
    support: "Hỗ trợ CNTT",
    copyright: "© 2026 Trường đại học. Tất cả các quyền được bảo lưu.",
  },
} as const;
