export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const slugify = (text) => {
    return text
      .toLowerCase()                      // chuyển thành chữ thường
      .normalize('NFD')                   // tách dấu tiếng Việt
      .replace(/[\u0300-\u036f]/g, '')    // xóa dấu
      .replace(/[^a-z0-9\s-]/g, '')       // xóa ký tự đặc biệt
      .trim()                             // xóa khoảng trắng đầu đuôi
      .replace(/\s+/g, '-')               // thay khoảng trắng bằng dấu gạch ngang
      .replace(/-+/g, '-');               // loại bỏ gạch ngang thừa
  };
