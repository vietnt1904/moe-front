import { useState } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Image,
  Group,
  Stack,
  Center,
  Box,
  Paper,
} from "@mantine/core";
import { useAllNotifications } from "../hooks/useNotification";
import { Check } from "lucide-react";
import { getUserId, updateTime } from "../utils";
import { useNavigate } from "react-router-dom";
import NotificationService from "../services/NotificationService";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

// Notification Item Component (to avoid repetition)
const NotificationItem = ({ notification, onClick, onClickChangeRead }) => {
  return (
    <Paper radius="md" className="w-full flex relative gap-4 mb-4">
      <div className="flex gap-4 relative">
        <Box
          w={{ base: "25%", sm: "16.66%", lg: "8.33%" }}
          className="flex justify-center overflow-hidden items-start hover:cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            onClick(notification);
          }}
        >
          <Image
            src={notification?.image}
            alt="Ảnh truyện đại diện"
            width="75%"
            height="auto"
            fit="contain"
            radius={"md"}
          />
        </Box>
        <Box
          w={{ base: "75%", sm: "80%", lg: "91.66%" }}
          onClick={(e) => {
            e.preventDefault();
            onClick(notification);
          }}
          className="hover:cursor-pointer"
        >
          <Text size="lg" fw={600} className="text-wrap">
            Bạn có thông báo mới!
          </Text>
          <Text size="md" fw={400} lineClamp={3}>
            {notification?.content}
          </Text>
          <Text
            fw={500}
            className="absolute base:-top-6 sm:top-0 right-4 text-sm"
          >
            {updateTime(notification?.createdAt)}
          </Text>
        </Box>
        <Center>
          <Button
            onClick={(e) => {
              e.preventDefault();
              onClickChangeRead(notification);
            }}
          >
            {notification?.isRead ? "Chưa xem" : "Đã xem"}
          </Button>
        </Center>
      </div>
    </Paper>
  );
};

const NotificationPage = () => {
  const [unreadVisible, setUnreadVisible] = useState(true);
  // In a real app, you'd likely fetch notifications here using useEffect
  // const [unreadNotifications, setUnreadNotifications] = useState(
  //   unreadNotificationsData
  // );
  // const [readNotifications, setReadNotifications] = useState(
  //   readNotificationsData
  // );
  const [changeState, setChangeState] = useState(false);

  const userId = getUserId();

  const { data: notifications, refetch } = useAllNotifications(userId);
  let readNotifications =
    notifications?.filter((notification) => notification?.isRead) || [];

  let unreadNotifications =
    notifications?.filter((notification) => !notification?.isRead) || [];

  useEffect(() => {
    if (changeState) {
      refetch();
      setChangeState(false);
    }
  }, [changeState, refetch]);

  const queryClient = useQueryClient();

  const handleMarkAllRead = async () => {
    await NotificationService.readAllNotifications(userId);
    queryClient.invalidateQueries(["notification", "unreadNotification"]);
    setChangeState(true);
  };

  const handleLoadMore = () => {
    // Placeholder for loading more read notifications
  };

  const navigate = useNavigate();

  const handleClick = (notification) => {
    changeReadStatus(notification);
    navigate(`/story/${notification?.storyUrl}`);
  };

  const changeReadStatus = async (notification) => {
    await NotificationService.changeIsReadStatus(notification?.id, {
      isRead: !notification?.isRead,
    });
    queryClient.setQueryData(
      ["notification", "unreadNotification"],
      (oldData) =>
        oldData?.map((n) =>
          n.id === notification.id ? { ...n, isRead: !n.isRead } : n
        )
    );
    setChangeState(true);
  };

  return (
    <div>
      <Box className="my-12">
        <Title order={1} align="center" className="text-5xl font-bold">
          Thông báo
        </Title>
      </Box>
      {notifications?.length === 0 ? (
        <div className="flex flex-col gap-4 justify-center items-center">
          <Text size="xl" fw={600}>
            Bạn chưa có thông báo nào!
          </Text>
          {!userId && (
            <Text size="lg" fw={600}>
              Hãy đăng nhập để nhận thông báo từ chúng tôi!
            </Text>
          )}
        </div>
      ) : (
        <Container size="lg" className="w-11/12 mt-4 min-h-screen pt-12">
          <Stack gap="xl">
            {/* ----------------------------- Chưa đọc Section --------------------- */}
            {unreadVisible && unreadNotifications?.length > 0 && (
              <Box id="chua_doc" className="w-full">
                <Group justify="space-between" mb="lg">
                  <Title order={3} className="text-2xl font-bold">
                    Chưa đọc
                  </Title>
                  <Button
                    onClick={handleMarkAllRead}
                    variant="default"
                    radius="xl"
                    leftSection={<Check />}
                    className="text-gray-500 font-bold pr-16 pl-6 py-2"
                  >
                    Đánh dấu tất cả đã đọc
                  </Button>
                </Group>
                <Stack gap="md">
                  {unreadNotifications?.map((notification) => (
                    <NotificationItem
                      onClick={handleClick}
                      onClickChangeRead={changeReadStatus}
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </Stack>
              </Box>
            )}
            {/* ----------------------------- Đã đọc Section --------------------- */}
            <Box className="w-full">
              <Group justify="space-between" mb="md">
                <Title order={3} className="text-2xl font-bold mt-4">
                  Đã đọc
                </Title>
              </Group>
              <Stack gap="md" className="mb-12 md:mb-16 lg:mb-20">
                {readNotifications?.map((notification) => (
                  <NotificationItem
                    onClick={handleClick}
                    onClickChangeRead={changeReadStatus}
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </Stack>
            </Box>
            {/* ----------------------------- Load More Button --------------------- */}
            {readNotifications?.length > 0 && (
              <Center className="w-full mb-12">
                <Button
                  onClick={handleLoadMore}
                  color="yellow"
                  radius="xl"
                  size="lg"
                  className="text-white font-bold text-2xl"
                >
                  Xem thêm
                </Button>
              </Center>
            )}
          </Stack>
        </Container>
      )}
    </div>
  );
};

export default NotificationPage;
