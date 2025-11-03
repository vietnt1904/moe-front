import { useState, useRef } from "react";
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
  Textarea,
  Select,
  Paper,
  SimpleGrid,
  ActionIcon,
  Center,
  Rating,
  Tooltip,
} from "@mantine/core";
import { IconChevronUp } from "@tabler/icons-react";
import { IconChevronDown } from "@tabler/icons-react";
import { Clock4 } from "lucide-react";
import { Eye } from "lucide-react";
import StoryCard from "../components/StoryCard";
import { Link, useParams, useNavigate, Navigate } from "react-router-dom";
import {
  convertNumber,
  getIdTitleFromUrl,
  getUserId,
  slugify,
  updateTime,
} from "../utils";
import {
  useStoriesSameAuthor,
  useStory,
  useStoryFollowers,
} from "../hooks/useStory";
import { useChaptersByStoryId } from "../hooks/useChapter";
import RateService from "../services/RateService.js";
import { notifications } from "@mantine/notifications";
import CommentService from "../services/CommentService.js";
import { useCommentsByStoryId } from "../hooks/useComment.js";
import { Pagination } from "react-bootstrap";
import { useSaved } from "../hooks/useUser";
import UserService from "../services/UserService.js";
// Import icons if using an icon library
// import { IconClock, IconFlame, IconChevronDown, IconChevronUp, IconDots, IconEye, IconMessageCircle, IconDownload } from '@tabler/icons-react';

// --- Main Component ---
const StoryPage = () => {
  const { title: url } = useParams();
  const navigate = useNavigate();
  const { id, slug } = getIdTitleFromUrl(url); // id của story
  const { data: story } = useStory(id, slug);
  const { data: chapters } = useChaptersByStoryId(id);
  const { data: followers } = useStoryFollowers(id);

  const { data: sameAuthorStories } = useStoriesSameAuthor(story?.Author?.id);
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  const defaultBannerImage =
    "https://m.yodycdn.com/blog/hinh-nen-thien-nhien-4k-yody-vn-115.jpg";

  const [activeTab, setActiveTab] = useState("rating"); // 'rating' or 'discussion'
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [orderBy, setOrderBy] = useState("time"); // Time hoặc like
  const [isDesc, setIsDesc] = useState(true);
  const [showAllChapters, setShowAllChapters] = useState(false);
  const [rating, setRating] = useState(5); // Use Mantine Rating state
  const [ratingText, setRatingText] = useState("");
  const [expandedComments, setExpandedComments] = useState({}); // { commentId: true/false }
  const { data: dataComments } = useCommentsByStoryId(
    id,
    page,
    LIMIT,
    orderBy,
    isDesc
  );
  const totalPages = Math.floor(dataComments?.totalComments / LIMIT) + 1 || 1;
  const commentsData = dataComments?.comments || [];
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chapterListRef = useRef(null); // For scrolling

  const initialVisibleChapters = 10;
  const userId = getUserId();

  const { data: isSaved } = useSaved(userId, id);

  const [isStorySaved, setIsStorySaved] = useState(isSaved);

  const [isLoadingSaveStory, setIsLoadingSaveStory] = useState(false);
  const isRead = JSON.parse(localStorage.getItem(`bookmark${id}`) || "{}");

  const continueReading = chapters?.find(
    (chapter) => chapter?.id === isRead?.chapter
  );

  if (!id || !slug) {
    return <Navigate to="/" replace />;
  }

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const toggleShowAllChapters = () => {
    setShowAllChapters(!showAllChapters);
    if (showAllChapters && chapterListRef.current) {
      // Scroll up when collapsing
      chapterListRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const toggleCommentExpansion = (commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const getTabClassName = (tabName) => {
    const baseClasses =
      "w-64 py-4 text-2xl font-bold transition-all duration-300 ease-in-out";
    if (activeTab === tabName) {
      return `${baseClasses} border-t-4 border-white -mt-[4px] text-black`; // Active
    } else {
      return `${baseClasses} border-t-4 border-transparent text-gray-500 hover:text-gray-800`; // Inactive
    }
  };

  const isAuthor = story?.authorId === userId;

  const handleSubmitRating = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    const userId = userId || 1; // 1 là id người dùng ẩn danh
    const storyId = id;
    const submitRating = await RateService.addRateByStoryId(
      userId,
      storyId,
      rating,
      ratingText
    );
    if (submitRating) {
      setRating(5);
      setRatingText("");
      notifications.show({
        title: "Đánh giá truyện thành công",
        message: "Cảm ơn bạn đã đánh giá truyện",
        color: "green",
      });
    } else {
      notifications.show({
        title: "Đánh giá truyện thất bại",
        message: "Vui lòng thử lại sau",
        color: "red",
      });
    }
    setIsLoading(false);
  };

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const userId = userId || 1;
    const submitComment = await CommentService.addCommentByUserId(
      userId,
      id,
      null,
      commentText
    );
    if (submitComment) {
      setCommentText("");
      notifications.show({
        title: "Bình luận truyện thành công",
        message: "Cảm ơn bạn đã bình luận truyện",
        color: "green",
      });
    } else {
      notifications.show({
        title: "Bình luận truyện thất bại",
        message: "Vui lòng thử lại sau",
        color: "red",
      });
    }
    setIsLoading(false);
  };

  const handleScrollToChapterList = () => {
    if (chapterListRef.current) {
      chapterListRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const dataSelect = [
    { label: "Mới nhất", value: "desc" },
    { label: "Cũ nhất", value: "asc" },
    { label: "Nhiều lượt thích nhất", value: "like" },
  ];

  const handleSelectComment = (e) => {
    if (!e) {
      setOrderBy("time");
      setIsDesc(true);
      return;
    }
    if (e === "like") {
      setOrderBy("like");
      setIsDesc(true);
      return;
    } else {
      // asc hoặc desc
      setOrderBy("time");
      const setDesc = e === "desc";
      setIsDesc(setDesc);
      return;
    }
  };

  const handleSaveStory = async () => {
    let success;
    setIsLoadingSaveStory(true);
    if (isStorySaved) {
      success = await UserService.updateSaveStory(userId, id, false);
    } else {
      success = await UserService.updateSaveStory(userId, id, true);
    }
    if (success) {
      setIsStorySaved(!isStorySaved);
      notifications.show({
        title: isStorySaved
          ? "Bỏ theo dõi truyện thành công"
          : "Theo dõi truyện thành công",
        message: isStorySaved
          ? "Bạn đã bỏ theo dõi truyện"
          : "Cảm ơn bạn đã theo dõi truyện",
        color: "green",
      });
    } else {
      notifications.show({
        title: isStorySaved
          ? "Bỏ theo dõi truyện thất bại"
          : "Theo dõi truyện thất bại",
        message: "Vui lòng thử lại sau",
        color: "red",
      });
    }
    setIsLoadingSaveStory(false);
  };

  return (
    <>
      <Container size="lg" className="relative w-3/4 mx-auto mt-4 mb-36" p={0}>
        {/* Banner */}
        <Box className="mt-24 w-full overflow-hidden rounded-3xl h-40 md:h-72 lg:h-96 shadow-lg">
          <Image
            src={story?.bannerUrl || defaultBannerImage}
            alt="Ảnh nền truyện"
            className="block w-full h-full object-cover object-center opacity-60"
          />
        </Box>

        {/* Content Over Banner */}
        <Box className="absolute translate-y-[-50%] left-12 md:left-20 lg:left-24 w-11/12 md:w-10/12 lg:w-4/5">
          <Group
            wrap="nowrap"
            gap={{ base: "sm", lg: "xl" }}
            align="flex-start"
          >
            {/* Cover Image */}
            <Box className="w-1/4 flex-shrink-0">
              <Image
                src={story?.image}
                alt="Ảnh bìa truyện"
                radius={"md"}
                className="w-full h-auto object-cover object-center shadow-[3px_3px_3px_3px_rgba(0,0,0,0.4)]"
                style={{ aspectRatio: "2 / 3" }} // Maintain aspect ratio
              />
            </Box>

            {/* Right Side Details */}
            <Stack className="w-3/4 flex items-end" gap="sm">
              {/* Top Part: Title, Author, Time */}
              <Stack gap={0}>
                <Group gap={{ base: "xs", lg: "md" }} align="flex-end">
                  <Title
                    order={1}
                    className="text-xl md:text-4xl lg:text-5xl font-bold italic text-shadow-sm"
                  >
                    {story?.title}
                  </Title>
                  {/* Timestamp */}
                  <Group gap={4} align="center" className="ml-4 mb-1 md:mb-2">
                    {/* Replace with IconClock if available */}
                    <Clock4
                      color="#fff"
                      className="bg-black rounded-full flex w-3 h-3 md:w-4 md:h-4 lg:w-6 lg:h-6"
                    />
                    <Text
                      fw={600}
                      size="sm"
                      md="lg"
                      className="not-italic font-bold whitespace-nowrap"
                    >
                      Cập nhật {updateTime(story?.lastUpdate)}
                    </Text>
                  </Group>
                </Group>
                <Link to={`/author/${story?.Author?.id}`}>
                  <Text
                    fw={700}
                    size="lg"
                    md="xl"
                    lg="3xl"
                    className="italic font-bold pl-1 md:pl-4 hover:underline cursor-pointer"
                  >
                    {story?.Author?.fullName}
                  </Text>
                </Link>
              </Stack>

              <Stack gap="md">
                <Group gap="xs" wrap="wrap">
                  {story?.Topics?.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="filled"
                      color="white"
                      radius="sm"
                      size="sm"
                      md="md"
                      classNames={{
                        label: "text-black font-bold",
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </Group>

                {/* Action Buttons */}
                <Group gap="xs" md="md" wrap="wrap">
                  <Button
                    color="blue"
                    classNames={{
                      label: "text-white font-extrabold",
                    }}
                    radius="sm"
                    size="xs"
                    md="sm"
                    onClick={handleScrollToChapterList}
                  >
                    Chương
                  </Button>
                  {isRead && continueReading && (
                    <Button
                      color="white"
                      classNames={{
                        label: "text-black font-extrabold",
                      }}
                      variant="default"
                      radius="sm"
                      size="xs"
                      md="sm"
                      onClick={() =>
                        navigate(
                          `${slugify(continueReading?.title)}-${
                            continueReading?.id
                          }`
                        )
                      }
                    >
                      Đọc tiếp
                    </Button>
                  )}
                  <Button
                    color="white"
                    classNames={{
                      label: "text-black font-extrabold",
                    }}
                    variant="default"
                    radius="sm"
                    size="xs"
                    md="sm"
                    onClick={() =>
                      navigate(
                        `${slugify(chapters[chapters?.length - 1]?.title)}-${chapters[chapters?.length - 1]?.id}`
                      )
                    }
                  >
                    Đọc từ đầu
                  </Button>
                  { !isAuthor && userId && (userId !== 1) && (
                    <Button
                      color="white"
                      classNames={{
                        label: "text-black font-extrabold",
                      }}
                      variant="default"
                      radius="sm"
                      size="xs"
                      md="sm"
                      onClick={handleSaveStory}
                      loading={isLoadingSaveStory}
                      disabled={isLoadingSaveStory}
                    >
                      {isStorySaved !== undefined && isStorySaved !== null
                        ? isStorySaved
                          ? "Bỏ theo dõi"
                          : "Theo dõi"
                        : isSaved
                        ? "Bỏ theo dõi"
                        : "Theo dõi"}
                    </Button>
                  )}
                </Group>

                {/* Stats */}
                <Group
                  gap={0}
                  wrap="wrap"
                  className="ml-0 md:ml-8 font-extrabold text-xs md:text-sm"
                >
                  <Stack
                    align="center"
                    gap={0}
                    className="px-2 md:px-6 py-1 border-r-2 border-black"
                  >
                    <Text fw={700}>{chapters?.length}</Text>
                    <Text>Chương</Text>
                  </Stack>
                  <Stack
                    align="center"
                    gap={0}
                    className="px-2 md:px-6 py-1 border-r-2 border-black"
                  >
                    <Text fw={700}>{story?.views?.toLocaleString()}</Text>
                    <Text>Lượt đọc</Text>
                  </Stack>
                  <Stack
                    align="center"
                    gap={0}
                    className="px-2 md:px-6 py-1 border-r-2 border-black"
                  >
                    <Text fw={700}>{story?.rating}</Text>
                    <Text>Đánh giá</Text>
                  </Stack>
                  <Stack align="center" gap={0} className="px-2 md:px-6 py-1">
                    <Text fw={700}>{followers?.toLocaleString()}</Text>
                    <Text>Lượt theo dõi</Text>
                  </Stack>
                </Group>
              </Stack>
            </Stack>
          </Group>
        </Box>
      </Container>
      {/* --- Separator --- */}
      <Divider className="bg-gray-800 my-8 h-1 md:mt-16 lg:mt-24" />
      {/* --- Description Section --- */}
      <Container size="md" className="w-11/12 md:w-10/12 mx-auto mt-8">
        <Title
          order={2}
          className="font-bold text-3xl md:text-5xl mt-4 lg:mt-8 italic text-center mb-8"
        >
          Giới thiệu
        </Title>
        <Box className="relative mb-12">
          <Text
            size="lg" // Adjust size as needed
            className="px-3 font-semibold text-xl md:text-2xl transition-all duration-300 ease-in-out" // Use 'semibold' or 'bold'
            style={{
              maxHeight: isDescriptionExpanded ? "none" : "285px", // Control height
              overflow: "hidden",
            }}
          >
            {story?.description}
          </Text>
          {/* Show More/Less Button */}
          <Center mt="md">
            <Button
              variant="subtle"
              onClick={toggleDescription}
              rightSection={
                isDescriptionExpanded ? (
                  <IconChevronUp size={14} />
                ) : (
                  <IconChevronDown size={14} />
                )
              } // Replace with actual icons
              size="lg"
            >
              {isDescriptionExpanded ? "Thu gọn" : "Xem thêm"}
            </Button>
          </Center>
        </Box>
      </Container>
      {/* --- Separator --- */}
      <Divider className="bg-gray-800 h-1 my-8 md:my-12" />
      {/* --- Chapter List Section --- */}
      <Container
        size="lg"
        className="w-11/12 mx-auto mt-4"
        ref={chapterListRef}
      >
        <Box className="w-full md:w-11/12 justify-center mx-auto mt-12 lg:mt-16">
          <Stack gap="xs" id="chapterList" className="mb-8">
            <Title
              order={2}
              className="font-bold text-3xl md:text-5xl mt-4 lg:mt-8 italic text-center mb-8"
            >
              Danh sách chương
            </Title>
            {chapters?.length === 0 && (
              <Text size="lg" className="text-center">
                Chưa có chương nào. Hãy quay lại sau.
              </Text>
            )}
            {chapters?.map((chapter) => (
              <Link
                to={`${slugify(chapter?.title)}-${chapter?.id}`}
                key={chapter?.id}
                className="no-underline"
              >
                <Paper
                  withBorder
                  radius="lg"
                  p="sm"
                  className="flex items-center justify-between hover:bg-gray-100 transition-colors duration-200 border-2 border-black"
                >
                  <div className="flex items-center justify-between w-full">
                    <Text fw={500} c={"gray.8"} span>
                      {`Chương ${convertNumber(chapter?.chapterNumber)}`}
                      {chapter?.title ? `: ${chapter?.title}` : ""}
                    </Text>
                    <Group gap="xs" wrap="nowrap">
                      {/* Placeholder icons/stats for chapters */}
                      <Tooltip label="Lượt xem chương" openDelay={500}>
                        <Group gap={2}>
                          <Text size="xs">{chapter?.views ?? 0}</Text>
                          <Eye size={14} strokeWidth={1.5} />
                        </Group>
                      </Tooltip>
                    </Group>
                  </div>
                </Paper>
              </Link>
            ))}
          </Stack>

          {/* Show More/Less Chapters Button */}
          {chapters?.length > initialVisibleChapters && (
            <Center className="mt-8">
              <Button
                color="yellow"
                radius="xl"
                size="lg"
                onClick={toggleShowAllChapters}
                className="text-white font-bold text-xl md:text-2xl"
              >
                {showAllChapters ? "Ẩn bớt" : "Xem thêm"}
              </Button>
            </Center>
          )}
        </Box>
      </Container>
      {/* --- Separator --- */}
      <Divider className="bg-gray-800 h-1 my-8 md:my-12" />
      {/* --- Rating and Discussion Section --- */}
      <Container
        size="lg"
        className="relative flex flex-col items-center w-11/12 mx-auto"
      >
        {/* Tabs */}
        <Center className="w-full items-center justify-center border-gray-200 mb-8">
          <button
            className={getTabClassName("rating")}
            onClick={() => handleTabClick("rating")}
          >
            Đánh giá
          </button>
          <button
            className={getTabClassName("discussion")}
            onClick={() => handleTabClick("discussion")}
          >
            Thảo luận
          </button>
        </Center>

        {/* Content Area */}
        <Box className="w-full flex flex-col items-center mt-8">
          {/* Rating Form */}
          <Box
            className={`w-full md:w-2/3 ${
              activeTab === "rating" ? "block" : "hidden"
            }`}
          >
            <Box component="form" className="flex flex-col items-center">
              <Rating
                size="xl"
                value={rating}
                onChange={setRating}
                count={5}
                mb="xl"
              />
              <Textarea
                name="ratingText"
                value={ratingText}
                onChange={(e) => setRatingText(e.target.value)}
                placeholder="Hãy nêu cảm nghĩ của bạn nhé: ..."
                radius="lg" // rounded-3xl equivalent
                size="lg"
                minRows={4}
                className="h-36 w-full p-4 bg-gray-800 text-white placeholder:text-gray-300 mb-8"
                classNames={{
                  root: "rounded-2xl",
                  input: "text-white font-semibold text-xl md:text-2xl",
                }}
              />
              <Button
                type="submit"
                color="yellow"
                radius="xl"
                size="lg"
                className="text-white font-bold text-xl md:text-2xl"
                loading={isLoading}
                disabled={isLoading}
                onClick={handleSubmitRating}
              >
                Gửi đánh giá
              </Button>
            </Box>
          </Box>

          {/* Discussion Form and List */}
          <Box
            className={`w-full md:w-5/6 ${
              activeTab === "discussion" ? "block" : "hidden"
            }`}
          >
            {/* Comment Form */}
            <Center className="w-full mb-12">
              <Box component="form" className="w-full md:w-2/3 flex flex-col">
                <div className=" bg-gray-800 p-4 rounded-lg">
                  <textarea
                    name="commentText"
                    placeholder="Thảo luận:......"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="h-32 w-full p-2 text-black placeholder:text-gray-400 rounded-lg"
                  />
                </div>
                <Group justify="flex-end" mt="sm">
                  <Button
                    type="submit"
                    color="red" // Example: red-400
                    radius="xl"
                    size="md"
                    className="text-white font-bold text-lg md:text-xl px-6"
                    onClick={handleSubmitComment}
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    Gửi
                  </Button>
                </Group>
              </Box>
            </Center>

            {/* Comment List */}
            <Box className="mt-8">
              <Group justify="space-between" mb="lg">
                <Text size="xl" fw={700}>
                  {commentsData?.length || 0} thảo luận
                </Text>
                <Select
                  placeholder="Sắp xếp theo"
                  data={dataSelect}
                  defaultValue={"desc"}
                  radius="xl"
                  className="bg-gray-800 text-white font-bold rounded-full"
                  onChange={handleSelectComment}
                />
              </Group>

              <Stack gap="lg">
                {commentsData?.map((comment) => (
                  <Box key={comment?.id}>
                    <Paper
                      p="md"
                      radius="xl" // rounded-3xl
                      className="relative bg-gray-800 text-black w-full"
                    >
                      <Group justify="space-between" align="flex-start" mb="xs">
                        <Group gap="xs" align="flex-end">
                          <Image
                            src={comment?.User?.avatar}
                            alt="avatar"
                            w={32}
                            h={32}
                            className="min-w-[32px] min-h-[32px] rounded-full"
                            radius="50%"
                          />
                          <Text size="lg" fw={700}>
                            {comment?.User?.fullName}
                          </Text>
                          <Text size="sm" c="dimmed">
                            {updateTime(comment?.createdAt)}
                          </Text>
                        </Group>
                        <ActionIcon
                          variant="transparent"
                          className="text-black"
                        >
                          {/* <IconDots /> */} . . .
                        </ActionIcon>
                      </Group>

                      <Box className="relative mx-4 md:mx-12 pb-6">
                        <Text
                          size="md" // text-lg equivalent
                          className="text-black transition-all duration-300"
                          style={{
                            maxHeight: expandedComments[comment?.id]
                              ? "none"
                              : "5rem", // max-h-20 approx
                            overflow: "hidden",
                          }}
                        >
                          {comment?.content}
                        </Text>
                        {/* Read More/Less for Comment */}
                        <Button
                          variant="subtle"
                          size="xs"
                          onClick={() => toggleCommentExpansion(comment?.id)}
                          className="absolute bottom-0 right-0 text-xs text-black bg-gray-900/50 hover:bg-gray-900/80 px-2 py-1 rounded"
                        >
                          {expandedComments[comment?.id]
                            ? "Thu gọn"
                            : "Xem thêm"}
                        </Button>
                      </Box>
                    </Paper>
                    {/* Likes/Comments Count */}
                    <Group gap="xs" mt="xs" ml={12}>
                      <Badge variant="filled" color="dark" size="sm">
                        {comment.likes} tt
                      </Badge>
                      <Badge variant="filled" color="dark" size="sm">
                        {comment.replies} cmt
                      </Badge>
                    </Group>
                  </Box>
                ))}
                <Center mt="xl">
                  <Pagination
                    total={totalPages}
                    value={page}
                    onChange={setPage}
                  />
                </Center>
              </Stack>

              {/* Load More Comments Button */}
              <Center mt="xl">
                <Button
                  color="yellow"
                  radius="xl"
                  size="lg"
                  className="text-white font-bold text-xl md:text-2xl"
                >
                  Xem thêm bình luận
                </Button>
              </Center>
            </Box>
          </Box>
        </Box>
      </Container>
      {/* --- Separator --- */}
      <Divider className="bg-gray-800 my-8 h-1 md:my-12" />
      {/* --- Related Stories Section --- */}
      <Container size="lg" className="w-11/12 mx-auto mt-12 mb-32">
        <Title
          order={2}
          className="text-3xl md:text-4xl font-extrabold text-center mb-12 md:mb-20"
        >
          Truyện cùng tác giả
        </Title>
        <SimpleGrid
          cols={{ base: 2, sm: 3, md: 4 }}
          spacing={{ base: "md", lg: "xl" }}
        >
          {sameAuthorStories?.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
};

export default StoryPage;
