import { useState } from "react";
import {
  Container,
  Box,
  Image,
  Avatar,
  ActionIcon,
  Text,
  Group,
  Stack,
  Divider,
  SimpleGrid,
  Center,
  rem,
  Button,
  Modal, // For pixel-perfect sizing if needed
} from "@mantine/core";
import { WandSparkles } from "lucide-react";
import StoryCard from "../components/StoryCard";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getUserId, slugify } from "../utils";
import { useUser, useUserSubscribeStories } from "../hooks/useUser";
import { useAuthorStories, useFollowersOfAuthor } from "../hooks/useAuthor";
import { useDisclosure } from "@mantine/hooks";

const ProfilePage = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tab || "following"); // 'following' or 'myStories'
  const userId = getUserId();
  const navigate = useNavigate();
  if (!userId) {
    navigate("/");
  }
  const { data: myStories } = useAuthorStories(userId);
  const { data: user } = useUser(userId);
  const { data: unFilterSubscribeStories } = useUserSubscribeStories(userId);

  const filterUniqueStories = (stories) => {
    if (!stories || !Array.isArray(stories)) return [];

    const seenIds = new Set();
    const uniqueStories = stories.filter((story) => {
      if (!seenIds.has(story.storyId)) {
        seenIds.add(story.storyId);
        return true;
      }
      return false;
    });

    return uniqueStories;
  };

  const subscribeStories = filterUniqueStories(unFilterSubscribeStories);

  const { data: followers } = useFollowersOfAuthor(userId);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const [followersOpened, { open: followersOpen, close: followersClose }] =
    useDisclosure(false);
  const [followOpened, { open: followOpen, close: followClose }] =
    useDisclosure(false);

  // Define styles for active/inactive tabs reusing original CSS logic
  const getTabClassName = (tabName) => {
    let classes =
      "w-64 py-4 text-lg md:text-xl lg:text-2xl font-bold transition-all duration-300 ease-in-out "; // Base classes
    if (activeTab === tabName) {
      classes += "border-t-[5px] border-white -mt-[4px]"; // Active state
    } else {
      classes += "border-t border-transparent"; // Inactive state
    }
    return classes;
  };

  const [isEditAnhNen, setIsEditAnhNen] = useState(false);
  const handleOnClickAnhNen = () => {
    setIsEditAnhNen(!isEditAnhNen);
  };

  return (
    <>
      <Container size={"auto"} p={0} className="relative justify-center w-3/4">
        <Box
          onClick={handleOnClickAnhNen}
          className="relative mt-24 w-full overflow-hidden rounded-3xl h-auto max-h-[32em] shadow-lg"
        >
          <Image
            src={
              user?.backgroundImage ||
              "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/05/tai-anh-dep-ve-may-23.jpg"
            }
            alt="Ảnh nền"
            className={`w-full h-full object-fill shadow-lg object-center ${
              isEditAnhNen ? "opacity-60" : ""
            }`}
          />
          <Center className="absolute inset-0">
            <ActionIcon variant="transparent" size="lg">
              <WandSparkles
                className={`w-8 h-8 text-black transition-transform duration-200 ${
                  isEditAnhNen ? "" : "hidden"
                }`}
              />
            </ActionIcon>
          </Center>
        </Box>
        <Box
          className="absolute lg:bottom-[5%] sm:translate-y-[-50%] lg:translate-y-[0] left-4 md:left-8 lg:left-16 w-24 h-24 md:w-32 md:h-32 lg:w-48 lg:h-48" // Approximate calculation for overlap
        >
          <Avatar
            src={
              user?.avatar ||
              "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/05/tai-anh-dep-ve-may-23.jpg"
            }
            alt="Ảnh đại diện"
            radius="50%"
            size="100%"
            className="border-4 border-black"
          />
        </Box>

        <Box className="flex ml-0 md:ml-6 lg:ml-12 mt-4">
          <Box className="pl-32 md:pl-44 lg:pl-72 text-black text-2xl font-bold mt-3 pr-6 md:pr-8 lg:pr-12 w-full">
            <Group align="flex-end" gap={2} mb="xs">
              <p className="font-bold text-lg md:text-2xl">{user?.fullName}</p>
            </Group>
            <Group gap="xs" align="center" mb="xs">
              <Text size="lg" fw={500} className="max-w-[100%] overflow-hidden">
                {user?.email}
              </Text>
            </Group>

            {/* Stats */}
            <Stack gap={rem(4)} className="text-sm font-normal mt-3">
              {user?.stk && (
                <Text fw={700} maxW="100%" className="overflow-hidden">
                  Stk: {user?.stk}
                </Text>
              )}
              <Group gap="md">
                <Text className="cursor-pointer" onClick={followersOpen}>
                  <strong>{followers?.followers?.length || 0}</strong> Người
                  theo dõi
                </Text>
                <Modal
                  opened={followersOpened}
                  onClose={followersClose}
                  title={
                    <p className="font-semibold text-xl">
                      Những người đang theo dõi bạn
                    </p>
                  }
                >
                  {followers?.followers?.length > 0 ? (
                    <div>
                      {followers?.followers?.map((item) => {
                        <div key={item.id}>1</div>;
                      })}
                    </div>
                  ) : (
                    <p>Không có người dùng nào đang theo dõi bạn</p>
                  )}
                </Modal>
                <Text className="cursor-pointer" onClick={followOpen}>
                  Đang theo dõi{" "}
                  <strong>{followers?.follow?.length || 0}</strong> người dùng
                </Text>
                <Modal
                  opened={followOpened}
                  onClose={followClose}
                  title={
                    <p className="font-semibold text-xl">
                      Những người mà bạn đang theo dõi
                    </p>
                  }
                >
                  {followers?.follow?.length > 0 ? (
                    <div>
                      {followers?.follow?.map((item) => {
                        <div key={item.id}>123</div>;
                      })}
                    </div>
                  ) : (
                    <p>Bạn chưa theo dõi người dùng nào</p>
                  )}
                </Modal>
              </Group>
            </Stack>
          </Box>
        </Box>
      </Container>
      <Divider size="xs" className="bg-gray-800 mt-12 h-1" />
      <Container
        size="auto"
        className="relative flex flex-col justify-center w-11/12"
      >
        <Center className="w-full items-center justify-center">
          <button
            className={getTabClassName("following")}
            onClick={() => handleTabClick("following")}
          >
            Truyện theo dõi
          </button>
          <button
            className={getTabClassName("myStories")}
            onClick={() => handleTabClick("myStories")}
          >
            Truyện của tôi
          </button>
        </Center>

        {/* Tab Content */}
        <Box className="flex flex-col items-center mt-8 mb-24">
          {activeTab === "following" && (
            <Box id="following-content" className="container w-3/4 mt-12 mb-32">
              {subscribeStories?.length > 0 ? (
                <SimpleGrid
                  cols={{ base: 2, xs: 3, sm: 4 }} // Responsive columns
                  spacing={{ base: "md", lg: "xl" }} // Responsive spacing
                >
                  {subscribeStories?.map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story?.Story}
                      title={true}
                      status={true}
                    />
                  ))}
                </SimpleGrid>
              ) : (
                <Text align="center" mt="xl">
                  Bạn chưa theo dõi truyện nào.
                </Text>
              )}
            </Box>
          )}

          {/* My Stories Content */}
          {activeTab === "myStories" && (
            <Box
              id="my-stories-content"
              className="w-full lg:w-2/3 flex flex-col justify-center mt-12 mb-32"
            >
              {myStories?.length === 0 ? (
                <Stack align="center" gap="md">
                  <Text size="xl" fw={700} ta="center" c="blue.5">
                    Bạn chưa có truyện nào ư?
                  </Text>
                  <Image
                    src="/images/meo_chua_co_truyen.png"
                    maw={rem(300)}
                    alt="Mèo chưa có truyện"
                  />
                  {/* Max width */}
                  <Text size="xl" fw={700} ta="center" c="blue.5">
                    Hãy trở thành tác giả độc quyền của chúng tôi với nhiều ưu
                    đãi hấp dẫn nhé!
                  </Text>
                </Stack>
              ) : (
                <SimpleGrid
                  cols={{ base: 2, xs: 3, sm: 4 }}
                  spacing={{ base: "md", lg: "xl" }}
                >
                  {myStories?.map((story) => (
                    <div key={story?.id}>
                      <StoryCard story={story} />
                      <Link
                        to={`/story/author/${slugify(story?.title)}-${
                          story?.id
                        }`}
                        className="flex justify-end mt-2"
                      >
                        <Button>Xem chi tiết</Button>
                      </Link>
                    </div>
                  ))}
                </SimpleGrid>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default ProfilePage;
