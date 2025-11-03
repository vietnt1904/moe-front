import {
  Box,
  Card,
  ScrollArea,
  Text,
  useMantineColorScheme,
} from "@mantine/core";

const QAPage = () => {
  const dataMock = [
    {
      id: 1,
      question: "Câu hỏi 1",
      answer: "Câu trả lời 1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      question: "Câu hỏi 2",
      answer: "Câu trả lời 2",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      question: "Câu hỏi 3",
      answer: "Câu trả lời 3",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 4,
      question:
        "Câu hỏi 4: hehe cau hoi dai Bạn đã xem chương mới truyện của tớ chưa? Siêu hay luôn ý, mong bạn ủng hộ tớ rồi có gì nhắn tớ cảm nghĩ của bạn nhé!",
      answer:
        "Câu trả lời 4: test cau tra loi dai: BBạn đã xem chương mới truyện của tớ chưa? Siêu hay luôn ý, mong bạn ủng hộ tớ rồi có gì nhắn tớ cảm nghĩ của bạn nhé!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const { colorScheme } = useMantineColorScheme();

  return (
    <Box className="w-9/12 items-center mx-auto my-12 px-[10%]">
      <Card className="">
        <ScrollArea>
          {dataMock?.map((item) => (
            <Box key={item.id} className="w-full mb-8">
              <Box className="flex justify-start w-full mb-2">
                <Text
                  c={"black"}
                  size="lg"
                  px={8}
                  fw={400}
                  align={"left"}
                  className={`w-3/4 text-wrap rounded ${
                    colorScheme === "dark" ? "bg-gray-400" : "bg-gray-300"
                  }`}
                >
                  {item.question}
                </Text>
              </Box>
              <Box className="flex justify-end w-full">
                <Text
                  c={"black"}
                  size="lg"
                  px={8}
                  fw={400}
                  align={"right"}
                  className={`w-3/4 text-wrap rounded ${
                    colorScheme === "dark" ? "bg-blue-400" : "bg-blue-300"
                  }`}
                >
                  {item.answer}
                </Text>
              </Box>
            </Box>
          ))}
        </ScrollArea>
      </Card>
    </Box>
  );
};

export default QAPage;
