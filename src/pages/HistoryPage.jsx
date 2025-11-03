import {
  Container,
  Box,
  Title,
  Text,
  Image,
  Progress,
  Flex,
} from "@mantine/core";
import { useUserHistory } from "../hooks/useUser";
import { getUserId, updateTime } from "../utils";

const HistoryPage = () => {
  const userId = getUserId();
  const { data: listHistories } = useUserHistory(userId);
  
  return (
    <Box className="flex justify-center w-full mt-8 mb-8 min-h-screen">
      <Container size="xl" className="w-3/4">
        <Box className="w-full md:mr-28 lg:mr-48">
          {/* Header */}
          <Box className="pt-6 lg:px-[10%] pb-8 mb-2 rounded-xl w-full text-left">
            {/* Using Mantine Title */}
            <Title order={1} className="text-5xl font-bold">
              Lịch sử đọc truyện
            </Title>
          </Box>

          <Box className="ml-2 md:ml-12 lg:ml-24">
            {listHistories?.map((item) => {
              const progressColor = item.progress === 100 ? "green" : "blue";
              return (
                <Flex key={item.id} gap="md" mb="xl" m={4}>
                  <Box className="w-1/6 mr-0 md:mr-4 flex-shrink-0 flex items-start justify-end">
                    <Text size="md" fw={700}>
                      {updateTime(item.updatedAt)}
                    </Text>
                  </Box>

                  <Box className="md:mr-2 lg:mr-6 flex-shrink-0">
                    <Flex
                      direction="column"
                      align="center"
                      className="space-y-1 h-full"
                    >
                      <Box className="w-6 h-6 rounded-full border-4 border-black border-double"></Box>
                      <Box
                        className="flex-grow bg-black rounded-full shadow-sm mb-1"
                        style={{ width: "4px" }}
                      ></Box>
                    </Flex>
                  </Box>

                  <Box className="pl-4 pt-4">
                    <div className="flex space-x-4">
                      <Image
                        src={item.Story.image}
                        alt="Ảnh bìa truyện"
                        className="w-32 lg:w-44 h-auto flex-shrink-0"
                        w={196}
                        h="auto"
                      />
                      <Text size="lg" fw={700} lh={1.3} lineClamp={4}>
                        {item.Story.title}
                      </Text>
                    </div>
                    <Box className="max-h-16 overflow-hidden mb-2">
                      <Text size="xl" component="h4">
                        <Text span fw={700}>
                          Chương {item.Story.Chapters[0].chapterNumber}:{" "}
                        </Text>
                        <Text span>{item.Story.Chapters[0].title}</Text>
                      </Text>
                    </Box>

                    {/* <Flex align="center" gap="xs" className="text-lg pb-8">
                      <Text fw={700} className="mr-2">
                        Tiến độ đọc
                      </Text>
                      <Text fw={700} color={progressColor} className="mr-4">
                        {item.progress}%
                      </Text>
                      <Box className="relative w-72 max-w-md">
                        <Progress
                          value={item.progress}
                          color={progressColor}
                          size="sm" // Adjust size (xs, sm, md, lg, xl) ~ height
                          radius="xl" // Makes it rounded
                          className="h-1" // Tailwind height to match original
                        />
                        <Box
                          className="absolute -bottom-1 w-3 h-3 rounded-full shadow-md"
                          style={{
                            left: `${item.progress}%`,
                            transform: "translateX(-50%)",
                            backgroundColor: `var(--mantine-color-${progressColor}-6)`,
                          }} // Use Mantine color variable
                        />
                      </Box>
                    </Flex> */}
                  </Box>
                </Flex>
              );
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HistoryPage;
