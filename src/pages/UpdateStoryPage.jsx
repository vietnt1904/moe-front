import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Box,
  Image,
  Group,
  Stack,
  Title,
  Text,
  Badge,
  Button,
  Divider,
  Paper,
  SimpleGrid,
  Center,
  Grid,
  Anchor,
  Tooltip,
  TextInput,
  Radio,
  Select,
  MultiSelect,
  Checkbox,
  FileButton,
  LoadingOverlay, // For loading states
  Alert, // For displaying errors
  Loader, // Simple loader
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconChevronUp,
  IconChevronDown,
  IconAlertCircle,
  IconHeart,
  IconBookmark,
  IconEye as IconEyeTabler, // Renamed to avoid conflict with lucide-react Eye
  IconStar,
} from "@tabler/icons-react";
import { MessageSquareMore, Eye } from "lucide-react"; // Used in chapter list
import { Link, useParams, useNavigate, Navigate } from "react-router-dom";
import { formatDate, getIdTitleFromUrl, slugify } from "../utils"; // Assuming utils exist
import { useChaptersByStoryId } from "../hooks/useChapter"; // Assuming custom hook exists
import { useTopic } from "../hooks/useTopic"; // Assuming custom hook exists
import { useGenre } from "../hooks/useGenre"; // Assuming custom hook exists
import { useStory } from "../hooks/useStory"; // Assuming custom hook exists
import StoryService from "../services/StoryService"; // Assuming service exists
import { IconPlus } from "@tabler/icons-react";
import { useForm } from "@mantine/form";

// --- Static Data ---
const phanLoaiOptions = [
  { value: "original", label: "Truyện sáng tác" },
  { value: "translated", label: "Truyện dịch" },
];

const thoiGianDienRaOptions = [
  { value: "Cổ đại", label: "Cổ đại" },
  { value: "Trung đại", label: "Trung đại" },
  { value: "Hiện đại", label: "Hiện đại" },
  { value: "Tương lai", label: "Tương lai" },
  { value: "Không xác định", label: "Không xác định" },
];

const ketTruyenOptions = [
  { value: "HE", label: "HE" },
  { value: "BE", label: "BE" },
  { value: "OE", label: "OE" },
  { value: "SE", label: "SE" },
];


const defaultBannerImage = "/images/anh_bia_mac_dinh.png"; // Provide a path to your default image

// --- Main Component ---
const UpdateStoryPage = () => {
  const { title: url } = useParams(); // Get the combined ID-slug from URL
  const navigate = useNavigate();
  const { id: storyId, slug } = getIdTitleFromUrl(url || ""); // Extract ID and slug

  // --- Data Fetching Hooks ---
  const {
    data: story,
    error: storyError,
    isLoading: storyLoading,
  } = useStory(storyId, slug);
  const { data: chapters, isLoading: chaptersLoading } =
    useChaptersByStoryId(storyId); // Optional: for chapter list display
  const { data: topics, isLoading: topicsLoading } = useTopic();
  const { data: genres, isLoading: genresLoading } = useGenre();

  // --- State ---
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false); // For display section
  const [showAllChapters, setShowAllChapters] = useState(false); // For chapter list display
  const chapterListRef = useRef(null); // For scrolling chapter list
  const [coverImagePreview, setCoverImagePreview] =
    useState(defaultBannerImage);
  const [currentImageFile, setCurrentImageFile] = useState(null); // Holds the selected File object
  const [isEdit, setIsEdit] = useState(false);

  // --- Map Options ---
  const topicOptions =
    topics?.map((t) => ({ value: t.id.toString(), label: t.name })) || [];
  const genreOptions =
    genres?.map((g) => ({ value: g.id.toString(), label: g.name })) || [];

  // --- Form Hook ---
  const form = useForm({
    initialValues: {
      title: "",
      authorName: "",
      description: "",
      type: "original",
      timeline: "hiện đại",
      genre: [],
      topic: [],
      ending: "HE",
      is18Plus: false,
      releaseSchedule: [],
      image: null, // Will hold the original image URL or null initially, then maybe the File object
    },
    validate: {
      title: (value) =>
        value.trim().length > 0 ? null : "Tên tác phẩm không được để trống",
      authorName: (value) =>
        value.trim().length > 0 ? null : "Tác giả không được để trống",
      description: (value) =>
        value.trim().length > 0 ? null : "Giới thiệu không được để trống",
      releaseSchedule: (value) =>
        value?.length > 0 ? null : "Vui lòng chọn lịch ra chương",
      genre: (value) =>
        value?.length > 0 ? null : "Vui lòng chọn ít nhất một thể loại",
      topic: (value) =>
        value?.length > 0 ? null : "Vui lòng chọn ít nhất một chủ đề",
      // Image validation might be tricky on update - do they *have* to provide one *again*?
      // Usually, you only validate if they *tried* to upload an invalid one.
      // Let's skip direct form validation here and rely on the presence check or backend validation.
    },
  });

  // --- Effect to Populate Form When Story Data Loads ---
  useEffect(() => {
    if (story) {
      form.setValues({
        title: story?.title || "",
        authorName: story?.authorName || story?.Author?.fullName || "",
        description: story?.description || "",
        type: story?.type || "original",
        timeline: story?.timeline || "hien_dai",
        genre: story?.Genres?.map((g) => g.id.toString()) || [],
        topic: story?.Topics?.map((t) => t.id.toString()) || [],
        ending: story?.ending || "HE",
        is18Plus: story?.is18Plus || false,
        releaseSchedule: JSON.parse(story?.releaseSchedule || "[]")
          ? story?.releaseSchedule
          : [],
        image: story?.image || null, // Store original image URL/null
      });
      setCoverImagePreview(story?.image || defaultBannerImage);
      setCurrentImageFile(null); // Reset file state on initial load
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story]); // Dependency: story data

  // --- Effect to Update Image Preview ---
  useEffect(() => {
    if (currentImageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(currentImageFile);
    } else {
      // If no new file, show the original image (from form state) or default
      setCoverImagePreview(form?.values?.image || defaultBannerImage);
    }
  }, [currentImageFile, form?.values?.image]); // Dependencies: new file and the image value in the form

  // --- Event Handlers ---
  const handleFileChange = (file) => {
    setCurrentImageFile(file); // Store the File object
    // Don't directly set form.values.image to the file here,
    // handle it during submission preparation.
  };

  const removeImage = () => {
    setCurrentImageFile(null);
    form.setFieldValue("image", null); // Signal removal in form state
    setCoverImagePreview(defaultBannerImage);
  };

  const handleScheduleChange = (newSchedule) => {
    const isSelectingKhongCoDinh =
      newSchedule.includes("không cố định") &&
      !form.values.releaseSchedule.includes("không cố định");
    const isSelectingOtherDayWhileKhongCoDinhChecked =
      newSchedule.length > form.values.releaseSchedule.length &&
      !isSelectingKhongCoDinh &&
      form.values.releaseSchedule.includes("không cố định");

    if (isSelectingKhongCoDinh) {
      form.setFieldValue("releaseSchedule", ["không cố định"]);
    } else if (isSelectingOtherDayWhileKhongCoDinhChecked) {
      form.setFieldValue(
        "releaseSchedule",
        newSchedule.filter((day) => day !== "không cố định")
      );
    } else {
      form.setFieldValue("releaseSchedule", newSchedule);
    }
  };

  const handleFormSubmit = async (values) => {

    if (!storyId) {
      notifications.show({
        title: "Lỗi",
        message: "Không tìm thấy ID truyện.",
        color: "red",
      });
      return;
    }

    const dataToSend = new FormData();

    // 1. Append non-image fields
    Object.keys(values).forEach((key) => {
      if (key === "image") {
        return;
      }
      // --- Updated logic to handle genre, topic, and releaseSchedule arrays ---
      else if (
        (key === "releaseSchedule" || key === "genre" || key === "topic") &&
        Array.isArray(values[key])
      ) {
        if (key === "genre" || key === "topic") {
          values[key].forEach((item) =>
            dataToSend.append(key + "[]", Number(item))
          );
        } else {
          values[key].forEach((item) => dataToSend.append(key + "[]", item));
        }
      }
      // --- End Update ---
      else if (values[key] !== null && values[key] !== undefined) {
        dataToSend.append(key, values[key]);
      }
    });

    // 2. Handle image field specifically
    if (currentImageFile) {
      // New image selected: append the file
      dataToSend.append("image", currentImageFile, currentImageFile.name);
    } else {
      dataToSend.append("keep_image", "true");
    }

    // 3. Call Update Service
    try {
      form.clearErrors(); // Clear previous API errors
      await StoryService.updateStory(storyId, dataToSend);

      notifications.show({
        title: "Thành công",
        message: "Thông tin truyện đã được cập nhật!",
        color: "teal",
        autoClose: 5000,
      });
      setIsEdit(false);
      navigate(`/story/author/${slugify(story?.title)}-${story?.id}`);
    } catch (error) {
      console.error("Error updating story:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Đã xảy ra lỗi khi cập nhật truyện.";
      notifications.show({
        title: "Cập nhật thất bại",
        message: errorMsg,
        color: "red",
      });
      form.setFieldError("apiError", errorMsg); // Show error near submit button
    }
  };

  // --- UI Helper Functions ---
  const toggleDescription = () =>
    setIsDescriptionExpanded(!isDescriptionExpanded);
  const toggleShowAllChapters = () => setShowAllChapters(!showAllChapters);
  const initialVisibleChapters = 10;
  const visibleChaptersData = showAllChapters
    ? chapters
    : chapters?.slice(0, initialVisibleChapters) || [];

  const statusColor = (status = story?.status) => {
    if (status === "active") return "green";
    if (status === "completed") return "blue";
    if (status === "pending") return "yellow";
    return "gray";
  };
  const getAuthorLink = () =>
    story?.Author?.id ? `/authors/${story?.Author?.id}` : "#";
  const getAuthorName = () =>
    story?.Author?.fullName || story?.authorName || "Không rõ";

  // --- Loading and Error States ---
  if (storyLoading || topicsLoading || genresLoading) {
    return (
      <Center style={{ height: "80vh" }}>
        <Loader size="xl" />
      </Center>
    );
  }

  if (storyError) {
    return (
      <Container size="md" mt="xl">
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Lỗi tải dữ liệu truyện!"
          color="red"
          variant="filled"
        >
          {storyError.message ||
            "Không thể tải thông tin chi tiết của truyện này. Vui lòng thử lại."}
          <Button
            component={Link}
            to="/"
            mt="md"
            color="white"
            variant="outline"
          >
            Về trang chủ
          </Button>
        </Alert>
      </Container>
    );
  }

  // If loading finished but story is still not found (e.g., invalid ID/slug)
  if (!story) {
    return <Navigate to="/404" replace />; // Or a dedicated "Not Found" page
  }


  // --- Render Component ---
  return (
    <>
      {/* --- Display Section (Existing Story Info) --- */}
      <Container
        size="lg"
        className="relative w-3/4 mx-auto mt-4 mb-36"
        p={0}
        mt="xl"
        hidden={isEdit}
      >
        <Title order={1} ta="center" mb="xl">
          Thông tin truyện hiện tại
        </Title>
        <div className="flex justify-end pr-8">
          <Button onClick={() => setIsEdit(true)} mb="md">
            Chỉnh sửa thông tin
          </Button>
        </div>
        <Paper shadow="xs" p="md" radius="md" withBorder>
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Center>
                <Image
                  src={story?.image || defaultBannerImage}
                  alt={`Bìa truyện ${story?.title}`}
                  radius="md"
                  fit="cover"
                  h={300}
                  w="auto"
                  maw="100%"
                  fallbackSrc="https://via.placeholder.com/300x450?text=No+Image"
                />
              </Center>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
              <Stack gap="xs">
                <Title order={3}>{story?.title}</Title>
                <Text fw={500} size="sm">
                  Người đăng:{" "}
                  <Anchor component={Link} to={getAuthorLink()} fw={500}>
                    {getAuthorName()}
                  </Anchor>
                </Text>
                <Text fw={500} size="sm">
                  Tác giả:{" "}
                  <Anchor component={Link} to={getAuthorLink()} fw={500}>
                    {story?.authorName || "Không rõ"}
                  </Anchor>
                </Text>

                <Group gap="xs" wrap="wrap">
                  <Text fw={500} size="sm">
                    Thể loại:
                  </Text>
                  {story?.Genres?.length > 0 ? (
                    story?.Genres.map((g) => (
                      <Badge
                        key={g.id}
                        component={Link}
                        to={`/genres/${slugify(g.name)}`}
                        variant="light"
                        color="blue"
                        size="sm"
                      >
                        {g.name}
                      </Badge>
                    ))
                  ) : (
                    <Text size="sm">Chưa có</Text>
                  )}
                </Group>
                <Group gap="xs" wrap="wrap">
                  <Text fw={500} size="sm">
                    Chủ đề:
                  </Text>
                  {story?.Topics?.length > 0 ? (
                    story?.Topics.map((t) => (
                      <Badge
                        key={t.id}
                        component={Link}
                        to={`/topics/${slugify(t.name)}`}
                        variant="light"
                        color="grape"
                        size="sm"
                      >
                        {t.name}
                      </Badge>
                    ))
                  ) : (
                    <Text size="sm">Chưa có</Text>
                  )}
                </Group>

                <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm" mt="xs">
                  <Box>
                    {" "}
                    <Text size="sm">Trạng thái:</Text>{" "}
                    <Badge
                      color={statusColor(story?.status)}
                      variant="light"
                      size="sm"
                      tt="capitalize"
                    >
                      {story?.status || "N/A"}
                    </Badge>{" "}
                  </Box>
                  <Box>
                    {" "}
                    <Text size="sm">Loại:</Text>{" "}
                    <Text size="sm" tt="capitalize">
                      {story?.type || "N/A"}
                    </Text>{" "}
                  </Box>
                  <Box>
                    {" "}
                    <Text size="sm">Bối cảnh:</Text>{" "}
                    <Text size="sm" tt="capitalize">
                      {story?.timeline || "N/A"}
                    </Text>{" "}
                  </Box>
                  <Box>
                    {" "}
                    <Text size="sm">Kết truyện:</Text>{" "}
                    <Text size="sm" tt="uppercase">
                      {story?.ending || "N/A"}
                    </Text>{" "}
                  </Box>
                  {story?.is18Plus && (
                    <Box>
                      <Badge color="red" size="sm">
                        18+
                      </Badge>
                    </Box>
                  )}
                </SimpleGrid>

                <Group gap="lg" mt="sm">
                  <Tooltip label="Lượt xem">
                    <Group gap={4}>
                      <IconEyeTabler size={16} stroke={1.5} />{" "}
                      <Text size="sm">{story?.views ?? 0}</Text>
                    </Group>
                  </Tooltip>
                  <Tooltip label="Lượt thích">
                    <Group gap={4}>
                      <IconHeart size={16} stroke={1.5} color="red" />{" "}
                      <Text size="sm">{story?.likes ?? 0}</Text>
                    </Group>
                  </Tooltip>
                  <Tooltip label="Theo dõi">
                    <Group gap={4}>
                      <IconBookmark size={16} stroke={1.5} color="blue" />{" "}
                      <Text size="sm">{story?.followers ?? 0}</Text>
                    </Group>
                  </Tooltip>
                  <Tooltip label="Đánh giá">
                    <Group gap={4}>
                      <IconStar size={16} stroke={1.5} color="orange" />{" "}
                      <Text size="sm">
                        {story?.rating?.toFixed(1) ?? "N/A"}/5
                      </Text>
                    </Group>
                  </Tooltip>
                </Group>

                <Box mt="sm">
                  <Title order={5} mb={3}>
                    Giới thiệu
                  </Title>
                  <Text
                    lineClamp={isDescriptionExpanded ? undefined : 4}
                    size="sm"
                  >
                    {story?.description || <Text>Chưa có giới thiệu.</Text>}
                  </Text>
                  {story?.description &&
                    story?.description.length > 150 && ( // Show button only if description is long enough
                      <Button
                        variant="subtle"
                        size="xs"
                        onClick={toggleDescription}
                        rightSection={
                          isDescriptionExpanded ? (
                            <IconChevronUp size={14} />
                          ) : (
                            <IconChevronDown size={14} />
                          )
                        }
                      >
                        {isDescriptionExpanded ? "Thu gọn" : "Xem thêm"}
                      </Button>
                    )}
                </Box>

                <SimpleGrid cols={{ base: 2, sm: 2 }} spacing="sm" mt="xs">
                  <Text size="sm">
                    Ngày đăng: {formatDate(story?.createdAt)}
                  </Text>
                  <Text size="sm">
                    Cập nhật: {formatDate(story?.updatedAt)}
                  </Text>
                </SimpleGrid>

                <Text size="sm" mt={3}>
                  Lịch ra chương:{" "}
                  <Text span fw={500} tt="capitalize">
                    {story?.releaseSchedule == null
                      ? "Chưa rõ"
                      : JSON.parse(story?.releaseSchedule)?.join(", ").replace(/_/g, " ")}
                  </Text>
                </Text>
              </Stack>
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>

      {/* --- Update Form --- */}
      <Container
        hidden={!isEdit}
        size="md"
        className="relative w-3/4 mx-auto mt-12 mb-36"
        p={0}
      >
        <Title order={2} ta="center" mb="xl">
          Chỉnh sửa thông tin truyện
        </Title>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleFormSubmit(form.values);
          }}
        >
          {/* Loading overlay during form submission */}
          <LoadingOverlay
            visible={form.submitting}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />

          <TextInput
            size="lg"
            label="Tên tác phẩm:"
            className="my-2"
            disabled
            classNames={{
              label: "text-xl font-bold text-white",
              input:
                "h-10 pl-2 pr-8 rounded-lg border-solid border-gray-700 border-2 text-black bg-gray-200",
            }}
            required
            {...form.getInputProps("title")}
          />
          <TextInput
            size="lg"
            label="Tác giả/đồng tác giả:"
            className="my-2"
            classNames={{
              label: "text-xl font-bold text-white",
              input:
                "h-10 pl-2 pr-8 rounded-lg border-solid border-gray-700 border-2 text-black bg-gray-200",
            }}
            required
            {...form.getInputProps("authorName")}
          />
          <TextInput // Consider Textarea if needed
            size="lg"
            label="Giới thiệu:"
            className="my-2"
            classNames={{
              label: "text-xl font-bold text-white",
              input:
                "h-10 pl-2 pr-8 rounded-lg border-solid border-gray-700 border-2 text-black bg-gray-200", // Adjust height if Textarea
            }}
            required
            {...form.getInputProps("description")}
          />
          <Radio.Group
            label="Phân loại:"
            size="lg"
            classNames={{ label: "text-xl font-bold text-white" }}
            required
            {...form.getInputProps("type")}
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
                        form.values.type === opt.value
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-200 text-black hover:bg-gray-300"
                      }`,
                      inner: "hidden",
                    }}
                  />
                </Grid.Col>
              ))}
            </Grid>
          </Radio.Group>
          <Select
            label={"Thời gian diễn ra câu chuyện:"}
            size="lg"
            data={thoiGianDienRaOptions}
            className="my-2"
            classNames={{
              label: "text-xl font-bold text-white",
              input:
                "w-full h-10 pl-2 pr-8 rounded-lg border-2 border-gray-700 bg-gray-200 font-bold text-black text-lg",
              dropdown: "bg-opacity-50 backdrop-blur-sm",
              item: "text-lg font-bold text-black text-center hover:bg-gray-300",
            }}
            withScrollArea={false}
            styles={{ dropdown: { maxHeight: 200, overflowY: "auto" } }}
            allowDeselect={false}
            required
            {...form.getInputProps("timeline")}
          />

          <MultiSelect
            label={"Thể loại:"}
            size="lg"
            data={genreOptions}
            placeholder="Chọn thể loại (có thể chọn nhiều)"
            className="my-2"
            classNames={{
              label: "text-xl font-bold text-white",
              // Input might need height adjustment for multiple selections
              input:
                "min-h-10 w-full pl-2 pr-8 rounded-lg border-2 border-gray-700 bg-gray-200 font-bold text-black text-lg flex flex-wrap items-center",
              dropdown: "bg-opacity-50 backdrop-blur-sm",
              item: "text-lg font-bold text-black text-center hover:bg-gray-300", // Check item styling
              // Add styles for selected value pills if needed
              pill: "bg-blue-500 text-white",
            }}
            // searchable
            clearable // Allow clearing all selections
            withScrollArea={false}
            styles={{ dropdown: { maxHeight: 200, overflowY: "auto" } }}
            // allowDeselect is implicit in MultiSelect
            required
            {...form.getInputProps("genre")} // Bind to form state (expects/provides array)
          />
          <MultiSelect
            label={"Chủ đề:"}
            size="lg"
            data={topicOptions}
            placeholder="Chọn chủ đề (có thể chọn nhiều)"
            className="my-2"
            classNames={{
              label: "text-xl font-bold text-white",
              input:
                "min-h-10 w-full pl-2 pr-8 rounded-lg border-2 border-gray-700 bg-gray-200 font-bold text-black text-lg flex flex-wrap items-center",
              dropdown: "bg-opacity-50 backdrop-blur-sm",
              item: "text-lg font-bold text-black text-center hover:bg-gray-300",
              pill: "bg-blue-500 text-white",
            }}
            // searchable
            clearable
            withScrollArea={false}
            styles={{ dropdown: { maxHeight: 200, overflowY: "auto" } }}
            required
            {...form.getInputProps("topic")} // Bind to form state (expects/provides array)
          />

          <Select
            label={"Kết truyện:"}
            size="lg"
            data={ketTruyenOptions}
            className="my-2"
            classNames={{
              label: "text-xl font-bold text-white",
              input:
                "w-full h-10 pl-2 pr-8 rounded-lg border-2 border-gray-700 bg-gray-200 font-bold text-black text-lg",
              dropdown: "bg-opacity-50 backdrop-blur-sm",
              item: "text-lg font-bold text-black text-center hover:bg-gray-300",
            }}
            required
            withScrollArea={false}
            styles={{ dropdown: { maxHeight: 200, overflowY: "auto" } }}
            allowDeselect={false}
            {...form.getInputProps("ending")}
          />
          <Radio.Group
            label={"Truyện có yếu tố 18+ không?"}
            size="lg"
            className="my-2"
            classNames={{ label: "text-xl font-bold text-white" }}
            required
            {...form.getInputProps("is18Plus")}
          >
            <Grid gutter="md" className="mt-1">
              <Grid.Col span={6}>
                <Radio
                  value={true}
                  label="Có"
                  classNames={{
                    root: "w-full",
                    labelWrapper: "w-full",
                    label: `flex items-center justify-center h-12 px-4 rounded-lg border-2 border-gray-700 cursor-pointer ${
                      form.values.is18Plus === true
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-200 text-black hover:bg-gray-300"
                    }`,
                    inner: "hidden",
                  }}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Radio
                  value={false}
                  label="Không"
                  classNames={{
                    root: "w-full",
                    labelWrapper: "w-full",
                    label: `flex items-center justify-center h-12 px-4 rounded-lg border-2 border-gray-700 cursor-pointer ${
                      form.values.is18Plus === false
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-200 text-black hover:bg-gray-300"
                    }`,
                    inner: "hidden",
                  }}
                />
              </Grid.Col>
            </Grid>
          </Radio.Group>

          <Checkbox.Group
            value={form.values.releaseSchedule}
            onChange={handleScheduleChange}
            label={"Lịch ra chương:"}
            size="lg"
            className="my-2"
            classNames={{ label: "mb-1 text-xl font-bold text-white" }}
            required
            error={form.errors.releaseSchedule}
          >
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 md:gap-4 lg:gap-6">
              {[
                { label: "Thứ 2", value: "Thứ 2" },
                  { label: "Thứ 3", value: "Thứ 3" },
                  { label: "Thứ 4", value: "Thứ 4" },
                  { label: "Thứ 5", value: "Thứ 5" },
                  { label: "Thứ 6", value: "Thứ 6" },
                  { label: "Thứ 7", value: "Thứ 7" },
                  { label: "Chủ nhật", value: "Chủ nhật" },
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
                      form.values.releaseSchedule.includes(day.value)
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-200 text-black hover:bg-gray-300"
                    }`,
                  }}
                />
              ))}
            </div>
            <div className="mt-2 w-full">
              <Checkbox
                value="không cố định"
                label="Không cố định"
                classNames={{
                  inner: "hidden",
                  root: "w-full sm:w-1/2 md:w-1/3 lg:w-1/4", // Adjust width as needed
                  labelWrapper: "w-full",
                  label: `flex items-center justify-center h-12 px-4 rounded-lg border-2 border-gray-700 cursor-pointer ${
                    form.values.releaseSchedule.includes("không cố định")
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-200 text-black hover:bg-gray-300"
                  }`,
                }}
              />
            </div>
          </Checkbox.Group>

          {/* --- Cover Image Update --- */}
          <Box mb="md">
            <Text fw={500} size="sm" mb={4}>
              Ảnh bìa
            </Text>
            <Group align="flex-start" gap="lg">
              <Image
                src={coverImagePreview}
                alt="Xem trước ảnh bìa"
                height="auto"
                radius="md"
                fallbackSrc={defaultBannerImage} // Fallback if src fails to load
                className="w-full h-auto rounded-xl max-w-[200px] sm:max-w-[250px] object-cover aspect-[3/4]"
              />
              <Stack gap="xs">
                <FileButton
                  onChange={handleFileChange}
                  accept="image/png,image/jpeg,image/webp" // Standard image types
                >
                  {(props) => <Button {...props}>Chọn ảnh mới</Button>}
                </FileButton>
                {currentImageFile && (
                  <Text size="sm" maw={200} truncate="end">
                    {currentImageFile.name}
                  </Text>
                )}
                {/* {(currentImageFile || form.values.image) && (
                  <Button
                    variant="outline"
                    color="red"
                    size="xs"
                    onClick={removeImage}
                    disabled={!form.values.image && !currentImageFile} // Disable if already no image
                  >
                    Xóa ảnh bìa
                  </Button>
                )} */}
                <Text size="sm">
                  Định dạng: PNG, JPG, WEBP. Kích thước tối đa 2MB.
                </Text>
                {/* Add validation error display for image if needed */}
                {form.errors.image && (
                  <Text c="red" size="xs">
                    {form.errors.image}
                  </Text>
                )}
              </Stack>
            </Group>
          </Box>

          {/* --- Action Buttons --- */}
          {form.errors.apiError && (
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title="Lỗi Server!"
              color="red"
              mb="md"
            >
              {form.errors.apiError}
            </Alert>
          )}
          <Group justify="center" mt="xl">
            <Button
              type="submit"
              size="md"
              loading={form?.submitting}
              disabled={!form?.isDirty()} // Disable if no changes made
            >
              Lưu thay đổi
            </Button>
            <Button
              variant="default"
              size="md"
              onClick={() => setIsEdit(false)} // Go back to story detail page
              disabled={form?.submitting}
            >
              Hủy bỏ
            </Button>
          </Group>
        </form>
      </Container>

      <Container
        size="lg"
        className="relative w-3/4 mx-auto mt-4 mb-36"
        p={0}
        mt="xl"
        hidden={isEdit}
      >
        {/* --- Chapter List Section (Optional) --- */}
        <Divider
          my="xl"
          w={"80%"}
          mx={"auto"}
          size={"md"}
          color="black"
          label={
            <Text size="lg" fw={600} c={"black"}>
              Danh sách chương
            </Text>
          }
          labelPosition="center"
        />
        <div className="flex justify-end mx-[20%]">
          <Link to={`/story/author/${slug}/writechapter?storyId=${story.id}`}>
            <Button bg={"blue.6"} size={"md"} mb={"md"}>
              Thêm chương mới
              <IconPlus className="ml-2" size="1rem" />
            </Button>
          </Link>
        </div>
        {chapters && chapters.length > 0 ? (
          <>
            <Container size="md" pb="xl" ref={chapterListRef}>
              <LoadingOverlay visible={chaptersLoading} />
              <Stack gap="xs" id="chapterList">
                {visibleChaptersData.map((chapter) => (
                  // Adjust link as per your chapter routing structure
                  <Link
                    to={`/stories/${storyId}/${slug}/chapters/${
                      chapter.id
                    }-${slugify(
                      chapter.title || `chuong-${chapter.chapterNumber}`
                    )}`}
                    key={chapter.id}
                    style={{ textDecoration: "none" }}
                  >
                    <Paper
                      withBorder
                      radius="md"
                      p="sm"
                      className="hover:bg-gray-100 transition-colors duration-150"
                    >
                      <Group justify="space-between">
                        <Text fw={500} size="sm" truncate="end" maw="70%">
                          {`Chương ${chapter?.chapterNumber}${
                            chapter?.title ? `: ${chapter?.title}` : ""
                          }`}
                        </Text>
                        <Group gap="xs" wrap="nowrap">
                          <Text size="sm" c="black" pr={8}>
                            {chapter?.status}
                          </Text>
                          {/* Placeholder icons/stats for chapters */}
                          <Tooltip label="Lượt xem chương" openDelay={500}>
                            <Group gap={2}>
                              <Eye size={14} strokeWidth={1.5} />
                              <Text size="xs">{chapter?.views ?? 0}</Text>
                            </Group>
                          </Tooltip>
                          <Tooltip label="Bình luận" openDelay={500}>
                            <Group gap={2}>
                              <MessageSquareMore size={14} strokeWidth={1.5} />
                              <Text size="xs">
                                {chapter?.commentCount ?? 0}
                              </Text>
                            </Group>
                          </Tooltip>
                          {/* Add download icon/logic if applicable */}
                          {/* <Download size={14} /> */}
                        </Group>
                      </Group>
                    </Paper>
                  </Link>
                ))}
              </Stack>
              {chapters.length > initialVisibleChapters && (
                <Center mt="lg">
                  <Button variant="light" onClick={toggleShowAllChapters}>
                    {showAllChapters
                      ? "Ẩn bớt"
                      : `Xem thêm (${
                          chapters.length - initialVisibleChapters
                        }) chương`}
                  </Button>
                </Center>
              )}
            </Container>
          </>
        ) : (
          <>
            <Container size="md" pb="xl">
              <Text ta="center" size="lg" fw={500} mt="xl">
                Chưa có chương nào!
              </Text>
            </Container>
          </>
        )}
      </Container>
    </>
  );
};

export default UpdateStoryPage;
