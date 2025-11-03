import { useState } from "react";
import {
  Container,
  TextInput,
  Button,
  SimpleGrid,
  Paper,
  Title,
  Text,
  Image,
  AspectRatio,
  Badge,
  Group,
  Loader,
  Center,
  Divider,
  Box,
  ActionIcon,
  Pagination,
  Select,
} from "@mantine/core";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSearchStories } from "../hooks/useStory"; // Đường dẫn tới hook của bạn
import { IconSearch, IconX, IconMoodSad } from "@tabler/icons-react";
import { slugify, updateTime } from "../utils"; // Giả sử bạn có các utils này
import { useTopic } from "../hooks/useTopic";
import { useEffect } from "react";

const StoryCard = ({ story }) => {
  // Component con để hiển thị mỗi truyện, có thể tách ra file riêng
  return (
    <Paper
      shadow="md"
      p="sm"
      radius="md"
      withBorder
      component={Link}
      to={`/story/${slugify(story?.title)}-${story?.id}`} // Sử dụng slug cho URL đẹp hơn
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200"
    >
      <AspectRatio ratio={2 / 3} className="mb-2">
        <Image
          src={story?.image || "/placeholder-image.png"} // Nên có ảnh placeholder
          alt={story?.title}
          radius="sm"
          fit="cover"
        />
      </AspectRatio>
      <Box className="flex flex-col flex-grow">
        <Title
          order={4}
          lineClamp={2}
          className="text-base font-semibold mb-1 h-12"
        >
          {story?.title}
        </Title>
        {story?.Author?.fullName && (
          <Text size="xs" c="dimmed" lineClamp={1} className="mb-1">
            Tác giả: {story.Author.fullName}
          </Text>
        )}
        <Text size="xs" c="dimmed" className="mb-2">
          Cập nhật: {updateTime(story?.createdAt)}
        </Text>
        <Group gap="xs" wrap="nowrap" className="mt-auto">
          {story?.views && (
            <Badge variant="light" size="xs">
              {story.views.toLocaleString()} lượt xem
            </Badge>
          )}
          {story?.chaptersCount && (
            <Badge variant="light" color="blue" size="xs">
              {story.chaptersCount} chương
            </Badge>
          )}
        </Group>
      </Box>
    </Paper>
  );
};

const SearchStoryPage = () => {
  const limit = 20;
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title");
  const topicId = searchParams.get("topic");
  const [searchTerm, setSearchTerm] = useState(title || "");
  const [searchAuthor, setSearchAuthor] = useState("");
  const [topic, setTopic] = useState(topicId || "0");
  const navigate = useNavigate();

  // Các state này sẽ được dùng để trigger query khi người dùng nhấn "Tìm"
  const [activeSearchTerm, setActiveSearchTerm] = useState(title || "");
  const [activeSearchAuthor, setActiveSearchAuthor] = useState("");

  const { data, isLoading, isError, error, isFetching } = useSearchStories(
    page,
    limit,
    activeSearchTerm,
    activeSearchAuthor
  );

  useEffect(() => {
    setTopic(topicId);
  }, [topicId]);
  const storyData = data?.stories || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);
  const { data: topics } = useTopic();
  const topicsOptions = [
    { value: "0", label: "Tất cả thể loại" }, // Lựa chọn cho "Tất cả"
    ...(topics?.map((topic) => ({
      value: topic?.id?.toString(), // 'value' sẽ là ID của topic
      label: topic?.name, // 'label' sẽ là tên topic hiển thị
    })) || []),
  ];
  const dataToShow = storyData.filter((story) => {
    if (!topic || topic === "0") {
      return true;
    }
    return story?.Topics && story?.Topics?.some((t) => t?.id === Number(topic));
  });

  const handleSearch = () => {
    setTopic("0");
    setPage(1);
    setActiveSearchTerm(searchTerm);
    setActiveSearchAuthor(searchAuthor);
  };

  const handleClearSearchTerm = () => {
    setSearchTerm("");
    if (activeSearchTerm) {
      setActiveSearchTerm("");
    }
  };

  const handleClearSearchAuthor = () => {
    setSearchAuthor("");
    if (activeSearchAuthor) {
      setActiveSearchAuthor("");
    }
  };

  const handleChangeTopic = (value) => {
    if (value === topic) {
      setTopic("0");
    } else {
      setTopic(value);
    }
  };

  return (
    <Container size="xl" p={0} className="w-9/12 items-center mx-auto my-12">
      <Paper shadow="sm" p="md" radius="md" withBorder className="mb-8">
        <Title
          order={2}
          className="text-center mb-6 text-2xl md:text-3xl font-bold"
        >
          Tìm kiếm truyện
        </Title>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb="md">
          <div>
            <TextInput
              label="Tìm theo tên truyện"
              placeholder="Nhập tên truyện..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSearch();
              }}
              rightSection={
                searchTerm ? (
                  <ActionIcon
                    onClick={handleClearSearchTerm}
                    variant="transparent"
                    title="Xóa"
                  >
                    <IconX size={16} />
                  </ActionIcon>
                ) : null
              }
              className="mb-2"
            />
          </div>
          <div>
            <TextInput
              label="Tìm theo tác giả"
              placeholder="Nhập tên tác giả..."
              value={searchAuthor}
              onChange={(event) => setSearchAuthor(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSearch();
              }}
              rightSection={
                searchAuthor ? (
                  <ActionIcon
                    onClick={handleClearSearchAuthor}
                    variant="transparent"
                    title="Xóa"
                  >
                    <IconX size={16} />
                  </ActionIcon>
                ) : null
              }
              className="mb-2"
            />
          </div>
        </SimpleGrid>
        <Center>
          <Button
            onClick={handleSearch}
            leftSection={<IconSearch size={18} />}
            loading={isFetching} // Hiển thị loading trên nút khi đang fetch
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            size="md"
          >
            Tìm kiếm
          </Button>
        </Center>
      </Paper>

      <Divider
        my="xl"
        size={"md"}
        className="pt-6"
        labelPosition="center"
        label={
          <Title order={3} c="black" className="text-xl md:text-2xl">
            Kết quả tìm kiếm
          </Title>
        }
      />

      <div className="flex gap-4 pb-8">
        <p className="font-semibold text-lg">Lọc theo thể loại:</p>
        {/* <Select data={topicsOptions} onChange={setTopic} value={topic} defaultValue={topic}/> */}
        <select
          className="p-2 border rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:border-blue-400 transition-all"
          name="topic"
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value);
            navigate(`/search?topic=${e.target.value}`);
          }}
        >
          {topicsOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading && ( // Loading ban đầu
        <Center className="h-60">
          <Loader size="lg" />
        </Center>
      )}

      {isError && (
        <Paper
          withBorder
          p="xl"
          radius="md"
          shadow="sm"
          className="text-center bg-red-50 border-red-200"
        >
          <IconMoodSad size={48} className="mx-auto text-red-500 mb-4" />
          <Title order={4} c="red.7" className="mb-2">
            Ôi không, có lỗi xảy ra!
          </Title>
          <Text c="dimmed">
            Không thể tải dữ liệu truyện. Vui lòng thử lại sau.
          </Text>
          <Text size="sm" c="red.6" mt="xs">
            Chi tiết: {error?.message}
          </Text>
        </Paper>
      )}

      {!isLoading && !isError && dataToShow?.length === 0 && (
        <Paper
          withBorder
          p="xl"
          radius="md"
          shadow="sm"
          className="text-center bg-yellow-50 border-yellow-200"
        >
          <IconSearch
            size={48}
            stroke={1.5}
            className="mx-auto text-yellow-600 mb-4"
          />
          <Title order={4} c="yellow.8" className="mb-2">
            Không tìm thấy kết quả nào
          </Title>
          <Text c="dimmed">
            Hãy thử với từ khóa khác hoặc kiểm tra lại bộ lọc tìm kiếm của bạn.
          </Text>
        </Paper>
      )}

      {!isLoading && !isError && dataToShow?.length > 0 && (
        <>
          <SimpleGrid
            cols={{ base: 2, md: 3, lg: 4 }} // Tăng số cột cho màn hình lớn hơn
            spacing={{ base: "sm", md: "md" }}
          >
            {dataToShow?.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </SimpleGrid>
          {/* TODO: Phân trang (Pagination) có thể thêm ở đây */}
          <Center mt="xl">
            <Pagination total={totalPages} value={page} onChange={setPage} />
          </Center>
        </>
      )}
    </Container>
  );
};

export default SearchStoryPage;
