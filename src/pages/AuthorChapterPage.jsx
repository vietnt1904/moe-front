import { useState } from "react";
import {
  Container,
  Box,
  Group,
  Text,
  Menu,
  Center,
  UnstyledButton,
  Notification,
  Modal,
  NumberInput,
  useMantineColorScheme,
  Breadcrumbs, // For error display
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconList,
  IconSettings,
  IconX,
} from "@tabler/icons-react"; // Using Tabler Icons bundled with Mantine
import {
  useChapterByAuthor,
  useChaptersByStoryId,
  useNextChapter,
  usePreviousChapter,
} from "../hooks/useChapter";
import { Link, useNavigate, useParams } from "react-router-dom";
import { convertNumber, getIdTitleFromUrl, getUserId, slugify } from "../utils";
import { useDisclosure } from "@mantine/hooks";
import parse from "html-react-parser";
import { useStoryByIdOfAuthor } from "../hooks/useAuthor";

// Helper function to format content (JS equivalent of the PHP logic)
const formatContent = (content) => {
  if (!content) return "";
  const contentWithoutAds = content.replace(
    /\(adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\)\.push\(\{\}\);/g,
    ""
  );
  // Basic word wrapping (CSS `word-wrap: break-word` or `overflow-wrap: break-word` is usually better)
  // Javascript doesn't have a direct equivalent of PHP's wordwrap that inserts newlines reliably for HTML rendering.
  // Instead, rely on CSS for wrapping within the container. We'll just return the cleaned content.
  // If you absolutely need hard breaks, you'd split the string and join with <br />, but it's fragile.
  return contentWithoutAds.split("\n").join("<br />"); // Preserve existing newlines as <br>
};

// --- React Component ---

const AuthorChapterPage = () => {
  const { story: storyTitle, chapter: title } = useParams();

  const { id: chapterId, slug: chapterSlug } = getIdTitleFromUrl(title); // id of chapter
  const { id: storyId, slug: storySlug } = getIdTitleFromUrl(storyTitle);

  const {data: story} = useStoryByIdOfAuthor(storyId, storySlug);  

  const { data: chapter, error } = useChapterByAuthor(chapterId, chapterSlug);
  const { data: chapters } = useChaptersByStoryId(storyId);

  const { data: previousChapter } = usePreviousChapter(
    chapterId,
    storyId,
    chapter?.chapterNumber
  );

  const { data: nextChapter } = useNextChapter(
    chapterId,
    storyId,
    chapter?.chapterNumber
  );

  const navigate = useNavigate();

  if (story?.authorId != getUserId()) {
    navigate("/", { replace: true });
  }

  const [opened, { close, open }] = useDisclosure(false);

  const { colorScheme } = useMantineColorScheme();

  const formattedContent = formatContent(chapter?.content);

  // const [isBookmarked, setIsBookmarked] = useState(false); // Local state for bookmark toggle
  const listFontFamily = [
    "font-sans", //"Arial, sans-serif",
    "font-serif", //"Times New Roman, serif",
    "font-mono", // "Courier New, monospace",
  ];

  const [fontSize, setFontSize] = useState(
    localStorage.getItem("fontSize") || 15
  );
  const [lineHeight, setLineHeight] = useState(
    localStorage.getItem("lineHeight") || 1.5
  );
  const [fontFamily, setFontFamily] = useState(
    localStorage.getItem("fontFamily") || "font-sans"
  );
  const [showError, setShowError] = useState(false); // Control error visibility

  const breadcrumbItems = [
    { title: "Trang chủ", href: "/" },
    {
      title: story?.title,
      href: `/story/author/${slugify(story?.title || "")}-${story?.id}`,
    },
    {
      title: `Chương ${convertNumber(chapter?.chapterNumber)}: ${
        chapter?.title
      }`,
      href: "#",
    }, // Current page, no link needed usually
  ].map((item, index, arr) => (
    <Link
      to={item.href}
      key={index}
      className={`text-red-400 ${index === arr.length - 1 ? "font-bold" : ""}`}
    >
      {item.title}
    </Link>
  ));

  return (
    <Container
      size="auto"
      p={0}
      className="w-full mt-[-40px] flex justify-center"
    >
      <Box className="w-3/4 mt-20 mb-12 md:mb-20">
        <Center className="my-12">
          <Breadcrumbs
            classNames={{
              separator: "text-red-400",
              breadcrumb: "text-red-400 text-2xl font-bold",
            }}
          >
            {breadcrumbItems}
          </Breadcrumbs>
        </Center>
        <Center className="mb-12">
          <Group gap="xl">
            {/* Previous Chapter Button */}
            <Link
              to={
                previousChapter
                  ? `/chapter/author/${slugify(story.title)}-${storyId}/${slugify(
                      previousChapter?.title
                    )}-${previousChapter?.id}`
                  : "#"
              }
              className={`text-center ${
                !previousChapter ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <Center>
                <IconChevronLeft size={32} className="text-gray-500" />
              </Center>
              <Text size="xl" fw={700} c="gray.7">
                Trước
              </Text>
            </Link>
            <Menu shadow="md" width={250}>
              <Menu.Target>
                <UnstyledButton className="text-center">
                  <Center>
                    <IconList size={32} className="text-gray-500" />
                  </Center>
                  <Text size="xl" fw={700} c="gray.7">
                    Chương
                  </Text>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown
                mah={"40rem"}
                h={"40%"}
                className="!overflow-y-scroll !w-[70%] md:!w-[50%] lg:!w-[40%]"
              >
                {chapters?.map((chap) => (
                  <Menu.Item
                    key={chap?.id}
                    className="text-xl font-bold !p-0 overflow-hidden my-1"
                  >
                    <Link
                      to={`/chapter/author/${slugify(story.title)}-${storyId}/${slugify(chap.title)}-${
                        chap.id
                      }`}
                    >
                      <Box className="block px-2 py-1 w-full border rounded border-gray-200 hover:bg-gray-200">
                        <Text truncate="end" size="lg" className="font-bold">
                          {`Chương ${convertNumber(chap?.chapterNumber)}: ${
                            chap?.title
                          }`}
                        </Text>
                      </Box>
                    </Link>
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>

            <Link
              to={
                nextChapter
                  ? `/chapter/author/${slugify(story.title)}-${storyId}/${slugify(
                      nextChapter?.title
                    )}-${nextChapter?.id}`
                  : "#"
              }
              className={`text-center ${
                !nextChapter ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <Center>
                <IconChevronRight size={32} className="text-gray-500" />
                {/* <Image src="/assets/images/sao_trang.png" className="w-8 h-8" alt="Next chapter" /> */}
              </Center>
              <Text size="xl" fw={700} c="gray.7">
                Sau
              </Text>
            </Link>
            {/* Cấu hình Button */}
            <UnstyledButton className="text-center" onClick={open}>
              <Center>
                <IconSettings size={32} className="text-gray-500" />
                {/* <Image src="/assets/images/sao_trang.png" className="w-8 h-8" alt="Settings" /> */}
              </Center>
              <Text size="xl" fw={700} c="gray.7">
                Cấu hình
              </Text>
            </UnstyledButton>

            <Modal opened={opened} onClose={close} title="Cấu hình trang đọc">
              <table>
                <tbody>
                  <tr>
                    <td className="px-4 py-2">Cỡ chữ:</td>
                    <td className="px-4 py-2">
                      <NumberInput
                        type="number"
                        value={fontSize}
                        min={5}
                        max={32}
                        step={0.1}
                        onChange={(value) => {
                          setFontSize(value);
                          localStorage.setItem("fontSize", value);
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Chiều cao chữ:</td>
                    <td className="px-4 py-2">
                      <NumberInput
                        type="number"
                        value={lineHeight}
                        min={0.1}
                        max={5}
                        step={0.1}
                        onChange={(value) => {
                          setLineHeight(value);
                          localStorage.setItem("lineHeight", value);
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Font chữ:</td>
                    <td className="px-4 py-2">
                      <select
                        className="w-full border border-gray-300 rounded-md px-2 py-1"
                        type="text"
                        value={fontFamily}
                        onChange={(e) => {
                          setFontFamily(e.target.value);
                          localStorage.setItem("fontFamily", e.target.value);
                        }}
                      >
                        {listFontFamily.map((font, index) => (
                          <option key={index} value={font}>
                            {font}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Modal>
          </Group>
        </Center>
        {/* Error Notification */}
        {showError && error && (
          <Notification
            icon={<IconX size="1.1rem" />}
            color="red"
            title="Lỗi"
            withCloseButton
            onClose={() => setShowError(false)} // Allow dismissing
            className="mb-4"
          >
            {error}
          </Notification>
        )}
        {/* Content Area */}
        <Box
          className={`px-4 md:px-6 py-4 shadow-sm rounded ${
            colorScheme === "dark" ? "bg-neutral-700" : "bg-white"
          }`}
        >
          <Text
            component="div"
            fw={400}
            lh={lineHeight}
            mih={"20vh"}
            fontFamily={fontFamily}
            size={fontSize}
            className="text-wrap font-medium"
          >
            <p
              className={`${fontFamily} select-none ${
                colorScheme === "dark" ? "text-white" : "text-black"
              }`}
            >
              {parse(formattedContent)}
            </p>
          </Text>
        </Box>
        <Center className="mt-12">
          <Group gap="xl">
            <Link
              to={
                previousChapter
                  ? `/chapter/author/${slugify(story.title)}-${storyId}/${slugify(
                      previousChapter?.title
                    )}-${previousChapter?.id}`
                  : "#"
              }
              className={`text-center ${
                !previousChapter ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <Center>
                <IconChevronLeft size={32} className="text-gray-500" />
              </Center>
              <Text size="xl" fw={700} c="gray.7">
                Trước
              </Text>
            </Link>
            <Menu shadow="md" width={250}>
              <Menu.Target>
                <UnstyledButton className="text-center">
                  <Center>
                    <IconList size={32} className="text-gray-500" />
                  </Center>
                  <Text size="xl" fw={700} c="gray.7">
                    Chương
                  </Text>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown
                mah={"40rem"}
                h={"40%"}
                className="!overflow-y-scroll !w-[70%] md:!w-[50%] lg:!w-[40%]"
              >
                {chapters?.map((chap) => (
                  <Menu.Item
                    key={chap?.id}
                    className="text-xl font-bold !p-0 overflow-hidden my-1"
                  >
                    <Link
                      to={`/chapter/author/${slugify(story.title)}-${storyId}/${slugify(chap.title)}-${
                        chap.id
                      }`}
                    >
                      <Box className="block px-2 py-1 w-full border rounded border-gray-200 hover:bg-gray-200">
                        <Text truncate="end" size="lg" className="font-bold">
                          {`Chương ${chap?.chapterNumber}: ${chap?.title}`}
                        </Text>
                      </Box>
                    </Link>
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>

            <Link
              to={
                nextChapter
                  ? `/chapter/author/${slugify(story.title)}-${storyId}/${slugify(
                      nextChapter?.title
                    )}-${nextChapter?.id}`
                  : "#"
              }
              className={`text-center ${
                !nextChapter ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <Center>
                <IconChevronRight size={32} className="text-gray-500" />
                {/* <Image src="/assets/images/sao_trang.png" className="w-8 h-8" alt="Next chapter" /> */}
              </Center>
              <Text size="xl" fw={700} c="gray.7">
                Sau
              </Text>
            </Link>
          </Group>
        </Center>
      </Box>
    </Container>
  );
};

export default AuthorChapterPage;
