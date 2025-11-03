import { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Text,
  Group,
  Textarea,
  useMantineColorScheme,
} from "@mantine/core";
import { useForm } from "@mantine/form"; // Import useForm
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ChapterService from "../services/ChapterService";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { getIdTitleFromUrl, getUserId } from "../utils";
import { useStoryByIdOfAuthor } from "../hooks/useAuthor";

const WriteChapter = () => {
  const [searchParams] = useSearchParams();
  const storyId = searchParams.get("storyId");
  // --- Constants ---
  const MAX_WORDS = 3000;
  const [wordCount, setWordCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { title: url } = useParams();
  const { id, slug } = getIdTitleFromUrl(url || "");
  const {
    data: story,
  } = useStoryByIdOfAuthor(id, slug);

  // --- Form Management with useForm ---
  const form = useForm({
    initialValues: {
      chapterNumber: "",
      title: "",
      content: "",
      storyId: storyId,
    },

    // Optional: Add validation rules here
    validate: {
      chapterNumber: (value) => {
        if (!value || value.trim() === "")
          return "Chương số không được để trống";
        if (isNaN(value)) return "Chương số phải là số thập phân hợp lệ";
        const num = parseFloat(value);
        if (num < 0) return "Chương số phải lớn hơn hoặc bằng 0";
        return null;
      },
      title: (value) =>
        value.trim().length > 0 ? null : "Tên tác phẩm không được để trống",
      content: (value) =>
        value.trim().length > 0 ? null : "Nội dung không được để trống",
      // Add other validations as needed
    },
  });

  // Effect for Word Count (watches the form value)
  useEffect(() => {
    const words = form.values.content
      .trim()
      .split(/\s+/)
      .filter((word) => word !== "");
    setWordCount(words.length);
  }, [form.values.content]); // Depend on the form field value

  // Custom handler for Textarea to enforce word count limit
  const handleContentChangeWithLimit = (event) => {
    const text = event.currentTarget.value;
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word !== "");

    if (words.length <= MAX_WORDS) {
      form.setFieldValue("content", text); // Update form state directly
    } else {
      // Trim the text to the max word count and update form state
      const trimmedText = words.slice(0, MAX_WORDS).join(" ");
      form.setFieldValue("content", trimmedText);
      // Update word count state immediately for responsiveness (optional, useEffect handles it)
      setWordCount(MAX_WORDS);
    }
  };

  if (story?.authorId != getUserId()) {
    navigate("/", { replace: true });
  }

  // Submission Handler
  const handleFormSubmit = async (values) => {
    // No need for event.preventDefault(), useForm's onSubmit handles it
    setIsLoading(true);
    await ChapterService.writeChapter(values)
      .then((data) => {
        if (data?.success === false) {
          notifications.show({
            title: "Lỗi thêm chương",
            message: data?.message,
            color: "red",
          });
          return;
        }

        notifications.show({
          title: "Thêm chương mới thành công",
          message: "Chương mới đã được thêm thành công",
          color: "green",
        });
        setTimeout(() => navigate(-1), 1000);
      })
      .catch((error) => {
        notifications.show({
          title: "Thêm truyện thất bại",
          message: "Vui lòng thử lại",
          color: "red",
        });
        console.log("Error:", error);
      })
      .finally(() => {
        form.reset();
        queryClient.invalidateQueries(["chapters", storyId]);
      });
    setIsLoading(false);
  };

  const { colorScheme } = useMantineColorScheme();

  // --- Render ---
  return (
    <div
      className={`flex justify-center w-full px-[12.5%] mx-auto gap-4 min-h-screen pt-12 ${
        colorScheme === "dark"
          ? ""
          : "bg-[linear-gradient(90deg,_#037770_3.43%,_#FFC7C7_86.18%)]"
      }`}
    >
      <div className="w-full lg:w-3/4 md:mr-28 lg:mr-48 mx-auto">
        <div className="pt-4 pb-8 mb-24 rounded-xl w-full font-bold text-left">
          <div className="pb-6">
            <p className="text-5xl font-bold">Viết chương mới</p>
            <p className="text-xl font-bold">
              Hãy lưu ý về quy tắc soạn thảo văn bản tại đấy
            </p>
          </div>

          {/* --- Form Element --- */}
          <form>
            <TextInput
              size="lg"
              label="Chương số:"
              className="my-2"
              classNames={{
                label: "text-xl font-bold text-white",
                input:
                  "h-10 pl-2 pr-8 rounded-lg border-solid border-gray-700 border-2 text-black bg-gray-200",
              }}
              required // HTML5 required
              {...form.getInputProps("chapterNumber")} // Bind to useForm
            />
            <TextInput
              size="lg"
              label="Tên chương:"
              className="my-2"
              classNames={{
                label: "text-xl font-bold text-white",
                input:
                  "h-10 pl-2 pr-8 rounded-lg border-solid border-gray-700 border-2 text-black bg-gray-200",
              }}
              required
              {...form.getInputProps("title")} // Bind to useForm
            />
            <Textarea
              label={"Nội dung:"}
              size="lg"
              placeholder="Nội dung"
              minRows={10}
              maxRows={20}
              autosize
              className="my-2"
              classNames={{
                label: "text-xl font-bold text-white",
                input:
                  "w-full pl-2 py-2 pr-8 rounded-lg border-solid border-gray-700 border-2 text-black font-bold text-lg bg-gray-200",
              }}
              required
              value={form.values.content}
              onChange={handleContentChangeWithLimit}
              error={form.errors.content}
            />
            <Text align="right" size="lg" className="text-gray-400">
              {wordCount}/{MAX_WORDS}
            </Text>

            <Group position="center" className="pt-4">
              {/* <Button
                type="button"
                onClick={() => {
                  const validationResult = form.validate();
                  if (!validationResult.hasErrors) {
                    handleFormSubmit(form.values, "draff");
                  } else {
                    console.log("Validation Errors:", validationResult.errors);
                  }
                }}
                className="text-white text-xl font-bold px-6 py-2 mx-2 w-full sm:w-auto rounded bg-blue-500 hover:bg-blue-600"
                size="xl"
              >
                Cài đặt khóa chương
              </Button> */}
              <Button
                type="button"
                loading={isLoading}
                disabled={isLoading}
                onClick={() => {
                  // Trigger validation before submitting
                  const validationResult = form.validate();
                  if (!validationResult.hasErrors) {
                    handleFormSubmit(form.values, "save");
                  }
                }}
                className="text-white text-xl font-bold px-6 py-2 mx-auto w-full sm:w-auto rounded bg-blue-500 hover:bg-blue-600"
                size="xl"
              >
                Lưu chương
              </Button>
            </Group>
            {form.errors.apiError && (
              <Text size="sm" align="center" mt="md">
                {form.errors.apiError}
              </Text>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default WriteChapter;
