import { useNavigate, useParams } from "react-router-dom";
import { useUser, useUserPaidStory } from "../hooks/useUser";
import { useBuyStory } from "../hooks/useStory";
import { Button, Paper, Text, Title } from "@mantine/core";
import { useState } from "react";
import UserService from "../services/UserService";
import { notifications } from "@mantine/notifications";
import { getUserId } from "../utils";

const BuyStoryPage = () => {
  const { id: storyId } = useParams();
  const { data: story } = useBuyStory(storyId);

  const userId = getUserId();

  const { data: user } = useUser(userId);

  const { data: isPaid } = useUserPaidStory(userId, storyId);
  const [loading, setIsLoading] = useState(false);


  const navigate = useNavigate();

  const handleBuyStory = async () => {
    setIsLoading(true);
    const data = await UserService.buyStory(userId, storyId, story?.price);
    if(data) {
        navigate(-1);
        notifications.show({
            color: "green",
            title: "Mua truyện thành công",
            message: "Hãy thưởng thức bộ truyện",
        })
    } else {
        notifications.show({
            color: "red",
            title: "Mua truyện thất bại",
            message: "Vui lòng thử lại sau",
        })
    }
    setIsLoading(false);
  };

  const handleBuySpiritStones = () => {
    navigate("/setting?tab=payment");
  };

  return (
    <div className="w-9/12 items-center mx-auto my-12">
      <Paper
        shadow="lg"
        p="xl"
        radius="xl"
        className="w-full bg-gray-100 font-bold text-left mb-8"
      >
        {userId ? (
          <div className="flex gap-8">
            <div className="w-1/4 aspect-[3/4]">
              <img
                src={story?.image}
                alt={story?.title}
                loading="lazy"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            {!isPaid ? (
              <div className="w-3/4">
                <Title order={3} className="my-1">
                  Bạn muốn mua truyện: {story?.title}
                </Title>
                <Title order={4}>Của tác giả : {story?.Author?.fullName}</Title>
                <div className="h-6"></div>
                <Text size="md">
                  Số linh thạch bạn có: <strong>{user?.spiritStones}</strong>{" "}
                  linh thạch
                </Text>
                <Text size="md">
                  Số linh thạch cần để mua: <strong>{story?.price}</strong> linh
                  thạch
                </Text>
                <div className="flex justify-center mt-6">
                  {user?.spiritStones >= story?.price ? (
                    <div className="flex flex-col justify-center items-center">
                      <Title order={4}>Xác nhận mua truyện</Title>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white flex items-center content-center font-bold py-2 px-4 rounded mt-4"
                        onClick={handleBuyStory}
                        disabled={loading}
                        loading={loading}
                      >
                        Mua ngay
                      </button>
                    </div>
                  ) : (
                    <div className="px-6 mt-4 flex flex-col justify-center items-center">
                      <Title order={4}>
                        Bạn không có đủ linh thạch để mua truyện này. Hãy nạp
                        thêm linh thạch.
                      </Title>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white flex items-center content-center font-bold py-2 px-4 rounded mt-4"
                        onClick={handleBuySpiritStones}
                      >
                        Nạp ngay
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-3/4">
                <Title order={3} className="my-1">
                  Bạn đã mua truyện {story?.title}
                </Title>
                <Text size="sm" className="inline">
                  Hãy thưởng thức truyện này nhé
                </Text>
              </div>
            )}
          </div>
        ) : (
          <div>
            <Title order={3} className="my-1">
              Bạn chưa đăng nhập
            </Title>
            <Text size="sm">
              Hãy đăng nhập để trải nghiệm tính năng này.
            </Text>
            <Button className="mt-6" onClick={() => navigate("/login")}>Đăng nhập ngay</Button>
          </div>
        )}
      </Paper>
    </div>
  );
};

export default BuyStoryPage;
