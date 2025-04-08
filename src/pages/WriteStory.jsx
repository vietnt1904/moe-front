import { useState, useEffect, useCallback } from "react";
import {
  TextInput,
  Select,
  Radio,
  Checkbox,
  Button,
  Image,
  Text,
  Group,
  Grid,
  Textarea,
  FileButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";

const theLoaiOptions = [
  { value: "hanh_dong", label: "Hành động" },
  { value: "phieu_luu", label: "Phiêu lưu" },
  { value: "tinh_cam", label: "Tình cảm" },
  { value: "hai_huoc", label: "Hài hước" },
  { value: "vien_tuong", label: "Khoa học viễn tưởng" },
  { value: "kinh_di", label: "Kinh dị" },
  { value: "trinh_tham", label: "Trinh thám" },
  { value: "ky_ao", label: "Kỳ ảo (Fantasy)" },
  { value: "kiem_hiep", label: "Kiếm hiệp" },
  { value: "tien_hiep", label: "Tiên hiệp" },
  { value: "huyen_huyen", label: "Huyền huyễn" },
  { value: "hoc_duong", label: "Học đường" },
  { value: "doi_thuong", label: "Đời thường" },
  { value: "lich_su", label: "Lịch sử" },
  { value: "trong_sinh", label: "Trọng sinh" },
  { value: "he_thong", label: "Hệ thống" },
  { value: "chinh_kich", label: "Chính kịch (Drama)" },
  { value: "dam_my", label: "Đam mỹ (Boy’s Love)" },
  { value: "bai_hoc_cuoc_song", label: "Bài học cuộc sống" },
];

const chuDeOptions = [
  { value: "tinh_yeu", label: "Tình yêu" },
  { value: "tinh_ban", label: "Tình bạn" },
  { value: "gia_dinh", label: "Gia đình" },
  { value: "truong_thanh", label: "Trưởng thành" },
  { value: "cong_ly", label: "Công lý" },
  { value: "tu_do", label: "Tự do" },
  { value: "su_hy_sinh", label: "Sự hy sinh" },
  { value: "su_song_va_cai_chet", label: "Sự sống và cái chết" },
  { value: "khat_vong", label: "Khát vọng" },
  { value: "niem_tin", label: "Niềm tin" },
  { value: "doi_khang_thien_ac", label: "Đối kháng Thiện – Ác" },
  { value: "tu_choi_so_phan", label: "Từ chối số phận" },
  { value: "chon_lua_dao_duc", label: "Chọn lựa đạo đức" },
  { value: "chua_lanh", label: "Chữa lành và tha thứ" },
];

const WriteStory = () => {
  // --- State Management ---
  const [storyType, setStoryType] = useState("truyen_sang_tac"); // Default value example
  const [has18Plus, setHas18Plus] = useState("khong"); // Default value example
  const [schedule, setSchedule] = useState([]);
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(
    "/images/anh_bia_mac_dinh.png"
  ); // Default image

  // Input field states (using individual useState hooks)
  const [tenTacPham, setTenTacPham] = useState("");
  const [tacGia, setTacGia] = useState("");
  const [gioiThieu, setGioiThieu] = useState("");
  const [tenChuong, setTenChuong] = useState("");
  const [thoiGianDienRa, setThoiGianDienRa] = useState("hien_dai");
  const [theLoai, setTheLoai] = useState(theLoaiOptions[0]?.value || ""); // Default to first category value
  const [chuDe, setChuDe] = useState(chuDeOptions[0]?.value || ""); // Default to first category value
  const [ketTruyen, setKetTruyen] = useState("HE");

  const MAX_WORDS = 3000;

  const phanLoaiOptions = [
    { value: "truyen_sang_tac", label: "Truyện sáng tác" },
    { value: "truyen_dich", label: "Truyện dịch" },
  ];

  const thoiGianDienRaOptions = [
    { value: "co_dai", label: "Cổ đại" },
    { value: "trung_dai", label: "Trung đại" },
    { value: "hien_dai", label: "Hiện đại" },
    { value: "tuong_lai", label: "Tương lai" },
    { value: "khong_xac_dinh", label: "Không xác định" },
  ];

  const ketTruyenOptions = [
    { value: "HE", label: "HE" },
    { value: "BE", label: "BE" },
    { value: "OE", label: "OE" },
    { value: "SE", label: "SE" },
  ];

  // --- Effects ---

  // Effect for Image Preview
  useEffect(() => {
    if (!coverImageFile) {
      // Optionally reset to default if file is cleared, or keep last valid preview
      // setCoverImagePreview('/assets/images/anh_bia_mac_dinh.png');
      return;
    }

    const objectUrl = URL.createObjectURL(coverImageFile);
    setCoverImagePreview(objectUrl);

    // Cleanup function to revoke the object URL
    return () => URL.revokeObjectURL(objectUrl);
  }, [coverImageFile]);

  // Effect for Word Count
  useEffect(() => {
    const words = content
      .trim()
      .split(/\s+/)
      .filter((word) => word !== "");
    setWordCount(words.length);
  }, [content]);

  // --- Handlers ---

  const handleContentChange = (event) => {
    const text = event.currentTarget.value;
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word !== "");

    if (words.length <= MAX_WORDS) {
      setContent(text);
    } else {
      // Optionally trim the text to the max word count
      const trimmedText = words.slice(0, MAX_WORDS).join(" ");
      setContent(trimmedText);
      // Update word count immediately for responsiveness
      setWordCount(MAX_WORDS);
    }
  };

  const handleScheduleChange = (newSchedule) => {
    const newValue = newSchedule.filter((day) => !schedule.includes(day));
    if (newValue.length > 0) {
      if (newValue.includes("khong_co_dinh")) {
        setSchedule(["khong_co_dinh"]);
      } else {
        setSchedule(newSchedule.filter((day) => day !== "khong_co_dinh"));
      }
    }
    else {
      setSchedule(newSchedule);
    }
  };

  const handleSubmit = (event, action) => {
    event.preventDefault();
    console.log("Form Submitted!");
    console.log("Action:", action); // 'luu_chuong' or 'khoa_chuong'

    const formData = {
      ten_tac_pham: tenTacPham,
      tac_gia: tacGia,
      gioi_thieu: gioiThieu,
      ten_chuong: tenChuong,
      story_type: storyType,
      thoi_gian_dien_ra: thoiGianDienRa,
      the_loai: theLoai,
      chu_de: chuDe,
      ket_truyen: ketTruyen,
      yeu_to_18: has18Plus,
      lich_ra_chuong: schedule, // Array of selected days/option
      noi_dung: content,
      anh_bia: coverImageFile, // Send the File object
    };

    console.log("Form Data:", formData);

    // --- TODO: Add API call logic here ---
    // Example using fetch:
    /*
        const apiEndpoint = '/api/your-endpoint'; // Replace with your actual endpoint
        const dataToSend = new FormData(); // Use FormData for file uploads

        Object.keys(formData).forEach(key => {
            if (key === 'anh_bia' && formData[key]) {
                dataToSend.append(key, formData[key], formData[key].name);
            } else if (key === 'lich_ra_chuong') {
                 // Backend might expect comma-separated string or array format
                 formData[key].forEach(item => dataToSend.append(key + '[]', item)); // Example for array
            }
             else {
                dataToSend.append(key, formData[key]);
            }
        });
         dataToSend.append('action', action); // Send the action type


        fetch(apiEndpoint, {
            method: 'POST',
            // Add headers if needed (e.g., for CSRF, Authorization)
            // headers: { 'X-CSRF-TOKEN': 'your_token', ... },
            body: dataToSend,
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Handle success (e.g., show message, redirect)
        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle error (e.g., show error message)
        });
        */
  };

  // Custom styles to mimic the original blue selection for radios/checkboxes if needed
  // (Mantine's default theme might be sufficient)
  const radioLabelStyles = (checked) => ({
    label: {
      backgroundColor: checked
        ? "var(--mantine-color-blue-6)"
        : "rgb(229 231 235)", // bg-gray-200
      color: checked ? "white" : "black",
      border: "2px solid var(--mantine-color-gray-7)",
      "&:hover": {
        backgroundColor: checked
          ? "var(--mantine-color-blue-7)"
          : "var(--mantine-color-gray-3)",
      },
    },
  });

  const checkboxLabelStyles = (checked) => ({
    label: {
      backgroundColor: checked
        ? "var(--mantine-color-blue-6)"
        : "rgb(229 231 235)", // bg-gray-200
      color: checked ? "white" : "black",
      border: "2px solid var(--mantine-color-gray-7)",
      "&:hover": {
        backgroundColor: checked
          ? "var(--mantine-color-blue-7)"
          : "var(--mantine-color-gray-3)",
      },
    },
    input: {
      // Ensure input is visually hidden but accessible
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0,
    },
  });

  return (
    <div className="flex justify-center w-full px-[12.5%] mx-auto gap-4 min-h-screen pt-12 bg-[linear-gradient(90deg,_#037770_3.43%,_#FFC7C7_86.18%)]">
      <div className="w-full lg:w-3/4 md:mr-28 lg:mr-48 mx-auto">
        <div className="pt-4 pb-8 mb-24 rounded-xl w-full font-bold text-left">
          <div className="pb-6">
            <p className="text-5xl font-bold">Viết tác phẩm mới</p>
            <p className="text-xl font-bold">
              Hãy lưu ý về quy tắc soạn thảo văn bản tại đấy
            </p>
          </div>
          <form onSubmit={(e) => handleSubmit(e, "default_action")}>
            {" "}
            {/* Add default action or handle specific button clicks */}
            {/* Use Mantine components, map props, use state */}
            <TextInput
              size="lg"
              label="Tên tác phẩm:"
              name="ten_tac_pham"
              value={tenTacPham}
              onChange={(event) => setTenTacPham(event.currentTarget.value)}
              className="my-2"
              classNames={{
                label: "text-xl font-bold text-white", // Style label
                input:
                  "h-10 pl-2 pr-8 rounded-lg border-solid border-gray-700 border-2 text-black bg-gray-200", // Style input
              }}
              required // Add validation if needed
            />
            <TextInput
              size="lg"
              label="Tác giả/đồng tác giả:"
              name="tac_gia"
              value={tacGia}
              onChange={(event) => setTacGia(event.currentTarget.value)}
              className="my-2"
              classNames={{
                label: "text-xl font-bold text-white",
                input:
                  "h-10 pl-2 pr-8 rounded-lg border-solid border-gray-700 border-2 text-black bg-gray-200",
              }}
              required
            />
            <TextInput
              size="lg" // Use TextInput or Textarea for 'Giới thiệu' based on expected length
              label="Giới thiệu:"
              name="gioi_thieu"
              value={gioiThieu}
              onChange={(event) => setGioiThieu(event.currentTarget.value)}
              className="my-2"
              classNames={{
                label: "text-xl font-bold text-white",
                input:
                  "h-10 pl-2 pr-8 rounded-lg border-solid border-gray-700 border-2 text-black bg-gray-200",
              }}
              required
            />
            <TextInput
              size="lg"
              label="Tên chương:"
              name="ten_chuong"
              value={tenChuong}
              onChange={(event) => setTenChuong(event.currentTarget.value)}
              className="my-2"
              classNames={{
                label: "text-xl font-bold text-white",
                input:
                  "h-10 pl-2 pr-8 rounded-lg border-solid border-gray-700 border-2 text-black bg-gray-200",
              }}
              required
            />
            <Radio.Group
              name="phan_loai"
              value={storyType}
              size="lg"
              onChange={setStoryType}
              classNames={{
                label: "text-xl font-bold text-white",
              }}
              label="Phân loại:"
              required
            >
              <Grid gutter="md" className="mt-1">
                {phanLoaiOptions?.map((opt) => (
                  <Grid.Col span={6} key={opt.value}>
                    <Radio
                      value={opt.value}
                      label={opt.label}
                      classNames={{
                        root: "w-full",
                        labelWrapper: "w-full",
                        label: `flex items-center justify-center h-12 px-4 rounded-lg border-2 border-gray-700 cursor-pointer ${
                          storyType === opt.value
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-gray-200 text-black hover:bg-gray-300"
                        }`,
                        inner: "hidden", // ẩn nút tròn
                      }}
                    />
                  </Grid.Col>
                ))}
              </Grid>
            </Radio.Group>
            <Select
              label={"Thời gian diễn ra câu chuyện:"}
              name="thoi_gian_dien_ra"
              value={thoiGianDienRa}
              onChange={setThoiGianDienRa}
              size="lg"
              data={thoiGianDienRaOptions}
              className="my-2"
              classNames={{
                label: "text-xl font-bold text-white",
                input:
                  "w-full h-10 pl-2 pr-8 rounded-lg border-2 border-gray-700 bg-gray-200 font-bold text-black text-lg",
                dropdown: "bg-opacity-50 backdrop-blur-sm", // Apply to dropdown if needed
                item: "text-lg font-bold text-black text-center hover:bg-gray-300", // Apply to options
              }}
              searchable
              required
            />
            <Select
              label={"Thể loại:"}
              size="lg"
              name="the_loai"
              value={theLoai}
              onChange={setTheLoai}
              data={theLoaiOptions} // Use fetched/prop data
              className="my-2"
              classNames={{
                label: "text-xl font-bold text-white",
                input:
                  "w-full h-10 pl-2 pr-8 rounded-lg border-2 border-gray-700 bg-gray-200 font-bold text-black text-lg",
              }}
              searchable
              required
            />
            <Select
              label={"Chủ đề:"}
              name="chu_de"
              size="lg"
              value={chuDe}
              onChange={setChuDe}
              data={chuDeOptions} // Use fetched/prop data (might be different from genre)
              className="my-2"
              classNames={{
                label: "text-xl font-bold text-white",
                input:
                  "w-full h-10 pl-2 pr-8 rounded-lg border-2 border-gray-700 bg-gray-200 font-bold text-black text-lg",
              }}
              searchable
              required
            />
            <Select
              label={"Kết truyện:"}
              name="ket_truyen"
              size="lg"
              value={ketTruyen}
              onChange={setKetTruyen}
              data={ketTruyenOptions}
              className="my-2"
              classNames={{
                label: "text-xl font-bold text-white",
                input:
                  "w-full h-10 pl-2 pr-8 rounded-lg border-2 border-gray-700 bg-gray-200 font-bold text-black text-lg",
              }}
              required
            />
            <Radio.Group
              name="yeu_to_18"
              label={"Truyện có yếu tố 18+ không?"}
              size="lg"
              value={has18Plus}
              onChange={setHas18Plus}
              className="my-2"
              classNames={{
                label: "text-xl font-bold text-white",
              }}
              required
            >
              <Grid gutter="md" className="mt-1">
                <Grid.Col span={6}>
                  <Radio
                    value="co"
                    label="Có"
                    radio="co"
                    classNames={{
                      root: "w-full",
                      labelWrapper: "w-full",
                      label: `flex items-center justify-center h-12 px-4 rounded-lg border-2 border-gray-700 cursor-pointer ${
                        has18Plus === "co" ? "bg-blue-500" : "bg-gray-200"
                      }`,
                      inner: "hidden",
                    }}
                    labelWrapper={
                      "flex items-center justify-center h-10 px-4 rounded-lg border-2 border-gray-700 cursor-pointer"
                    }
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Radio
                    value="khong"
                    label="Không"
                    classNames={{
                      root: "w-full",
                      labelWrapper: "w-full",
                      label: `flex items-center justify-center h-12 px-4 rounded-lg border-2 border-gray-700 cursor-pointer ${
                        has18Plus === "khong"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                      }`,
                      inner: "hidden",
                    }}
                  />
                </Grid.Col>
              </Grid>
            </Radio.Group>
            <Checkbox.Group
              value={schedule}
              onChange={handleScheduleChange}
              label={"Lịch ra chương:"}
              size="lg"
              className="my-2"
              classNames={{ label: "mb-1 text-white" }}
              required
            >
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 md:gap-4 lg:gap-6">
                {[
                  { label: "Thứ 2", value: "thu_2" },
                  { label: "Thứ 3", value: "thu_3" },
                  { label: "Thứ 4", value: "thu_4" },
                  { label: "Thứ 5", value: "thu_5" },
                  { label: "Thứ 6", value: "thu_6" },
                  { label: "Thứ 7", value: "thu_7" },
                  { label: "Chủ nhật", value: "chu_nhat" },
                ].map((day) => (
                  <Checkbox
                    key={day.value}
                    value={day.value}
                    label={day.label}
                    classNames={{
                      inner: "hidden",
                      root: "w-full",
                      labelWrapper: "w-full",
                      label: `flex items-center justify-center h-12 px-4 rounded-lg border-2 border-gray-700 cursor-pointer ${
                        schedule.includes(day.value)
                          ? "bg-blue-500"
                          : "bg-gray-200"
                      }`,
                    }}
                  />
                ))}
              </div>
              <div className="mt-2 w-full">
                <Checkbox
                  classNames={{
                    inner: "hidden",
                    root: "w-full",
                    labelWrapper: "w-full",
                  }}
                />
                <Checkbox
                  value="khong_co_dinh"
                  label="Không cố định"
                  classNames={{
                    inner: "hidden",
                    labelWrapper: "w-1/4",
                    label: `flex items-center justify-center h-12 px-4 rounded-lg border-2 border-gray-700 cursor-pointer ${
                      schedule.includes("khong_co_dinh")
                        ? "bg-blue-500"
                        : "bg-gray-200"
                    }`,
                  }}
                />
              </div>
            </Checkbox.Group>
            <Textarea
              label={"Nội dung:"}
              size="lg"
              name="noi_dung"
              placeholder="Nội dung"
              value={content}
              minRows={6}
              maxRows={10}
              autosize
              onChange={handleContentChange}
              className="my-2"
              classNames={{
                label: "text-xl font-bold text-white",
                input:
                  "w-full pl-2 py-2 pr-8 rounded-lg border-solid border-gray-700 border-2 text-black font-bold text-lg bg-gray-200", // Tailwind styles for input
              }}
              required
            />
            <Text align="right" size="lg" className="text-gray-400">
              {wordCount}/{MAX_WORDS}
            </Text>
            <div className="my-2">
              <p className="text-lg font-semibold text-white mb-1">
                Ảnh bìa: <span className="text-red-500">*</span>
              </p>
              <div className="flex gap-4">
                <Image
                  src={coverImagePreview}
                  alt="anh_bia preview"
                  height="auto"
                  radius="md"
                  className="w-full h-auto rounded-xl max-w-xs object-fill"
                />
                <FileButton
                  onChange={setCoverImageFile}
                  accept="image/png,image/jpeg,image/webp"
                  className="bg-white "
                >
                  {(props) => (
                    <Button
                      {...props}
                      color="white"
                      size="lg"
                      className="text-white font-bold text-xl"
                      bg={"blue"}
                    >
                      Chọn ảnh
                    </Button>
                  )}
                </FileButton>
                {coverImageFile && (
                  <Text
                    size="sm"
                    className="text-gray-400"
                    align="center"
                    mt={4}
                  >
                    {coverImageFile.name}
                  </Text>
                )}
              </div>
            </div>
            <Group position="center" className="pt-4">
              <Button
                type="button"
                onClick={(e) => handleSubmit(e, "khoa_chuong")}
                className="text-white text-xl font-bold px-6 py-2 mx-2 w-full sm:w-1/3 rounded bg-blue-500 hover:bg-blue-600" // Combine styles
                size="xl"
                w={"30%"}
              >
                Cài đặt khóa chương
              </Button>
              <Button
                type="submit"
                onClick={(e) => handleSubmit(e, "luu_chuong")}
                className="text-white text-xl font-bold px-6 py-2 mx-2 w-full sm:w-1/3 rounded bg-blue-500 hover:bg-blue-600"
                size="xl"
                w={"30%"}
              >
                Lưu chương
              </Button>
            </Group>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WriteStory;
