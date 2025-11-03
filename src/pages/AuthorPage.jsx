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
  Modal,
  Button, // For pixel-perfect sizing if needed
} from "@mantine/core";
import { WandSparkles } from "lucide-react";
import StoryCard from "../components/StoryCard";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthor, useFollowersOfAuthor } from "../hooks/useAuthor";
import { useStoriesSameAuthor } from "../hooks/useStory";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { useUserSubStoriesOfAuthor } from "../hooks/useUser";
import UserService from "../services/UserService";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { getUserId } from "../utils";

const AuthorPage = () => {
  const [activeTab, setActiveTab] = useState("following");
  const { id: authorId } = useParams();

  const userId = getUserId();

  const navigate = useNavigate();
  useEffect(() => {
    if (authorId == userId) {
      navigate(`/profile`, { replace: true });
    }
  });

  const { data: subStories } = useUserSubStoriesOfAuthor(userId, authorId);

  const { data: author } = useAuthor(authorId);
  if (!author) {
    navigate("/", { replace: true });
  }

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const { data: sameAuthorStories } = useStoriesSameAuthor(authorId);
  const { data: followers } = useFollowersOfAuthor(authorId);

  const [followersOpened, { open: followersOpen, close: followersClose }] =
    useDisclosure(false);
  const [followOpened, { open: followOpen, close: followClose }] =
    useDisclosure(false);

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

  const isSubscribed = followers?.followers?.some(
    (follower) => follower?.User?.id === userId
  );

  const queryClient = useQueryClient();

  const handleUserSubAuthor = async () => {
    const result = await UserService.userSubscribeAuthor(
      userId,
      authorId,
      !isSubscribed
    ); ///
    if (result) {
      queryClient.invalidateQueries(["followersOfAuthor", authorId]);
      if (isSubscribed) {
        notifications.show({
          color: "green",
          title: "Hủy theo dõi thành công",
          message: "Bạn đã hủy theo dõi tác giả.",
        });
      } else {
        notifications.show({
          color: "green",
          title: "Theo dõi tác giả thành công",
          message: "Bạn đã theo dõi tác giả thành công.",
        });
      }
    } else {
      notifications.show({
        color: "red",
        title: "Theo dõi tác giả thất bại",
        message: "Vui lòng thử lại sau.",
      });
    }
  };

  return (
    <>
      <Container size={"auto"} p={0} className="relative justify-center w-3/4">
        <Box
          onClick={handleOnClickAnhNen}
          className="relative mt-24 w-full overflow-hidden rounded-3xl h-auto max-h-[32em] shadow-lg"
        >
          <Image
            src={author?.backgroundImage}
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
          className="absolute lg:bottom-[0] sm:translate-y-[-50%] lg:translate-y-[0] left-4 md:left-8 lg:left-16 w-24 h-24 md:w-32 md:h-32 lg:w-48 lg:h-48" // Approximate calculation for overlap
        >
          <Avatar
            src={author?.avatar}
            alt="Ảnh đại diện"
            radius="50%"
            size="100%"
            className="border-4 border-black"
          />
        </Box>

        <Box className="flex ml-0 md:ml-6 lg:ml-12 mt-4">
          <Box className="pl-32 md:pl-44 lg:pl-72 text-black text-2xl font-bold mt-3 pr-6 md:pr-8 lg:pr-12 w-full">
            <Group align="flex-end" gap={2} mb="xs">
              <p className="font-bold text-lg md:text-2xl">
                {author?.fullName}
              </p>
              {isSubscribed && (
                <span className="flex text-xs lg:text-sm mx-2">
                  Đang theo dõi
                </span>
              )}
              {userId && userId !== 1 && (
                <Button
                  onClick={handleUserSubAuthor}
                  className="text-white bg-black rounded-3xl text-xs ml-4 md:text-sm px-2 py-0 font-semibold"
                >
                  {isSubscribed ? "Bỏ theo dõi" : "Theo dõi"}
                </Button>
              )}
            </Group>
            {/* Stats */}
            <Stack gap={rem(4)} className="text-sm font-normal mt-3">
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
                      Những người đang theo dõi tác giả
                    </p>
                  }
                >
                  {followers?.followers?.length > 0 ? (
                    <div className="flex flex-col max-h-[300px]">
                      {followers?.followers?.map((item) => {
                        return (
                          <div
                            key={item?.User?.id}
                            className="flex justify-between items-center mb-2 border-gray-300"
                          >
                            <span>{item?.User?.fullName}</span>
                            <Button
                              onClick={() => {
                                followersClose();
                                followClose();
                                navigate(`/author/${item?.User?.id}`);
                              }}
                            >
                              Xem
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p>Không có người dùng nào đang theo dõi tác giả này</p>
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
                      Những người mà tác giả đang theo dõi
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
                    <p>Tác giả này chưa theo dõi người dùng nào</p>
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
            Truyện của tác giả
          </button>
          <button
            className={getTabClassName("myStories")}
            onClick={() => handleTabClick("myStories")}
          >
            Truyện bạn theo dõi
          </button>
        </Center>

        {/* Tab Content */}
        <Box className="flex flex-col items-center mt-8 mb-24">
          {activeTab === "following" && (
            <Box id="following-content" className="container w-3/4 mt-12 mb-32">
              {sameAuthorStories?.length > 0 ? (
                <SimpleGrid
                  cols={{ base: 2, xs: 3, sm: 4 }} // Responsive columns
                  spacing={{ base: "md", lg: "xl" }} // Responsive spacing
                >
                  {sameAuthorStories.map((story) => (
                    <StoryCard key={story.id} story={story} />
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
              className="container w-3/4 mt-12 mb-32"
            >
              {subStories?.length === 0 ? (
                <Stack align="center" gap="md">
                  <Text size="xl" fw={700} ta="center" c="blue.5">
                    Bạn chưa chưa theo dõi truyện nào của tác giả này?
                  </Text>
                </Stack>
              ) : (
                <SimpleGrid
                  cols={{ base: 2, xs: 3, sm: 4 }}
                  spacing={{ base: "md", lg: "xl" }}
                >
                  {subStories.map((story) => (
                    <StoryCard key={story.id} story={story.Story} />
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

export default AuthorPage;
