import { Container, Title, Text, Stack, ThemeIcon, Button, Center } from '@mantine/core';
import { IconTools, IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const BuildingPage = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <Center className="my-auto"> {/* Tailwind: Căn giữa, full height, màu nền, padding */}
      <Container size="sm">
        <Stack align="center" gap="sm"> {/* Mantine: Sắp xếp các phần tử theo chiều dọc, căn giữa, khoảng cách lớn */}
          
          <ThemeIcon
            size={60} // Kích thước lớn cho icon
            radius="xl" // Bo tròn mạnh
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
            className="shadow-lg" // Tailwind: Thêm bóng đổ
          >
            <IconTools style={{ width: 'rem(40)', height: 'rem(40)' }} stroke={1.5} />
          </ThemeIcon>

          <Title order={2} ta="center" className="text-slate-700"> {/* Mantine: Title, Tailwind: màu chữ */}
            Tính năng đang được xây dựng!
          </Title>

          <Text c="dimmed" size="lg" ta="center"> {/* Mantine: Text, màu mờ, kích thước lớn, căn giữa */}
            Chúng tôi đang nỗ lực hết mình để sớm mang đến cho bạn trải nghiệm tốt nhất.
          </Text>

          <Text c="dimmed" size="md" ta="center">
            Vui lòng quay lại sau. Xin chân thành cảm ơn sự kiên nhẫn của bạn!
          </Text>

          <Button
            variant="light" // Kiểu button của Mantine
            color="blue"
            size="md"
            leftSection={<IconArrowLeft size={18} />}
            onClick={handleGoBack}
            className="mt-6"
          >
            Quay lại
          </Button>
        </Stack>
      </Container>
    </Center>
  );
};

export default BuildingPage;