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
    copyright: "Bản quyền © 2026 Scholarly Sanctuary. Bảo lưu mọi quyền.",
    errors: {
      unknown: "Đã xảy ra lỗi. Vui lòng thử lại.",
      http: {
        401: {
          title: "Phiên đăng nhập hết hạn",
          message: "Phiên của bạn đã hết hạn. Vui lòng đăng nhập lại.",
        },
        403: {
          title: "Không có quyền truy cập",
          message: "Bạn không có quyền thực hiện hành động này.",
        },
        404: {
          title: "Không tìm thấy tài nguyên",
          message: "Tài nguyên được yêu cầu không tồn tại.",
        },
        dismiss: "Đóng",
      },
    },
    loading: {
      title: "Đang tải",
      subtitle: "Đang chuẩn bị trải nghiệm của bạn...",
      redirecting: "Đang chuyển hướng...",
      initializing: "Đang khởi tạo dịch vụ...",
      ready: "Sẵn sàng",
    },
    language: "Ngôn ngữ",
    help: "Trợ giúp",
    security: "Chính sách bảo mật",
    terms: "Điều khoản dịch vụ",
    support: "Hỗ trợ CNTT",
    date: {
      justNow: "Vừa xong",
      hourAgo: "1 giờ trước",
      hoursAgo: "{{count}} giờ trước",
      yesterday: "Hôm qua",
      daysAgo: "{{count}} ngày trước",
      today: "Hôm nay",
      tomorrow: "Ngày mai",
    },
    placeholders: {
      tbd: "Chờ xác định",
      na: "N/A",
    },
    roomLabel: "Phòng",
  },
  nav: {
    brand: "Academic Atelier",
    portal: "Cổng thông tin",
    toggleSidebar: "Đóng/mở thanh điều hướng",
    dashboard: "Bảng điều khiển",
    browseRooms: "Tìm phòng",
    myBookings: "Đặt phòng của tôi",
    approvals: "Phê duyệt",
    settings: "Cài đặt",
    langEn: "EN",
    langVi: "VI",
    logout: "Đăng xuất",
  },
  dashboard: {
    greeting: "Chào mừng trở lại, {{name}}.",
    subtitle:
      "Không gian sáng tạo đang chờ bạn. Sẵn sàng đặt phòng học tiếp theo chưa?",
    newBooking: "Đặt phòng mới",
    hero: {
      createBooking: "Đặt phòng",
      viewSchedule: "Xem lịch",
    },
    stats: {
      totalBookings: "Tổng đặt phòng",
      upcomingToday: "Lịch đặt sắp tới",
      pendingRequests: "Yêu cầu đang chờ",
      labels: {
        lifetime: "Toàn bộ",
        active: "Đang hoạt động",
        awaiting: "Chờ xử lý",
      },
    },
    recentActivity: {
      title: "Hoạt động đặt phòng gần đây",
      subtitle: "Các tương tác và cập nhật trạng thái gần nhất của bạn",
      viewHistory: "Xem lịch sử",
      noActivity: "Không có hoạt động gần đây",
      status: {
        confirmed: "Đã xác nhận",
        submitted: "Đã gửi yêu cầu",
        checkIn: "Điểm danh thành công",
        cancelled: "Đã hủy",
        rejected: "Đã từ chối",
        unknown: "Hoạt động không xác định",
      },
    },
    recentRooms: {
      title: "Phòng đã xem gần đây",
      subtitle: "Dựa trên lịch sử duyệt web của bạn",
      empty: "Chưa có phòng nào được xem gần đây.",
    },
    upcomingBookings: {
      title: "Đặt phòng sắp tới của tôi",
      viewAll: "Xem tất cả",
      today: "Hôm nay",
      empty: "Không có đặt phòng sắp tới",
      createNew: "Tạo một đặt phòng mới để bắt đầu",
      browseRooms: "Duyệt các phòng trống →",
      loadError: "Không thể tải đặt phòng. Vui lòng làm mới.",
      status: {
        confirmed: "ĐÃ XÁC NHẬN",
        pending: "CHỜ DUYỆT",
        cancelled: "ĐÃ HỦY",
      },
    },
    loading: {
      message: "Đang tải bảng điều khiển...",
    },
    error: {
      title: "Không thể tải dữ liệu bảng điều khiển",
      message: "Vui lòng thử lại sau hoặc liên hệ hỗ trợ.",
    },
  },
  rooms: {
    pageTitle: "Tìm không gian của bạn",
    pageSubtitle: "Duyệt các phòng học có sẵn và đặt phòng",
    search: {
      placeholder: "Tìm theo tên phòng, mã phòng hoặc tòa nhà…",
      clearLabel: "Xóa tìm kiếm",
    },
    filters: {
      title: "Lọc phòng học",
      clearAll: "Xóa tất cả",
      clearAllFilters: "Xóa tất cả bộ lọc",
      availability: "Lịch trống",
      pickDate: "Chọn ngày",
      timeSlot: "Ca học",
      anyTime: "Tất cả ca",
      capacity: "Sức chứa (chỗ ngồi)",
      status: "Trạng thái",
      equipment: "Thiết bị",
      mobileToggle: "Bộ lọc",
    },
    sort: {
      title: "Sắp xếp",
      default: "Mặc định",
      newest: "Mới nhất trước",
      nameAsc: "Tên phòng (A → Z)",
      nameDesc: "Tên phòng (Z → A)",
      capacityAsc: "Sức chứa (thấp → cao)",
      capacityDesc: "Sức chứa (cao → thấp)",
    },
    view: {
      grid: "Dạng lưới",
      list: "Dạng danh sách",
    },
    availability: {
      available: "Còn trống",
      occupied: "Đang sử dụng",
      maintenance: "Bảo trì",
    },
    equipment: {
      projector: "Máy chiếu",
      whiteboard: "Bảng trắng",
      video_conference: "Hội nghị video",
      air_conditioning: "Điều hòa",
      computer_lab: "Phòng máy tính",
      smart_board: "Bảng thông minh",
      audio_system: "Hệ thống âm thanh",
    },
    card: {
      upTo: "Tối đa {{count}} người",
      moreEquipment: "+{{count}} thiết bị khác",
      viewDetails: "Xem chi tiết",
      checkAvailability: "Kiểm tra lịch trống",
      seats: "chỗ ngồi",
    },
    grid: {
      noResults: "Không có kết quả",
      showing: "Hiển thị {{shown}} trên {{total}} phòng",
      showingOne: "Hiển thị {{shown}} trên {{total}} phòng",
    },
    empty: {
      title: "Không tìm thấy phòng",
      withFilters: "Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.",
      noRooms: "Hiện tại không có phòng học nào.",
      clearFilters: "Xóa tất cả bộ lọc",
    },
    error: {
      loadFailed: "Không thể tải danh sách phòng. Vui lòng thử lại.",
      retry: "Thử lại",
    },
    pagination: {
      pageOf: "Trang {{page}} trên {{total}}",
    },
    status: {
      confirmed: "Đã xác nhận",
      pending: "Đang chờ",
      cancelled: "Đã hủy",
      available: "Còn trống",
      occupied: "Đang sử dụng",
      maintenance: "Bảo trì",
    },
  },
} as const;
