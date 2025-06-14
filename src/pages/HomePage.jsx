import { Carousel } from "@mantine/carousel";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Button, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import StoryCard from "../components/StoryCard";
import { useProposalStories, useStories, useStoriesAllTopics, useTrendingStories } from "../hooks/useStory";

const HomePage = () => {
  const page = 1;
  const limit = 10;

  const autoplay = useRef(Autoplay({ delay: 2000 }));
  const autoplayItem = useRef(Autoplay({ delay: 1000 }));
  const autoplayItem2 = useRef(Autoplay({ delay: 1500 }));
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const { data: storyData } = useStories(page, limit);
  const stories = storyData?.data || [];
  // const totalPages = storyData?.totalPages || 1;
  const {data: trendingStories} = useTrendingStories();
  const { data: topics } = useStoriesAllTopics();
  const {data: proposalStories} = useProposalStories();

  return (
    <div className="w-9/12 items-center mx-auto my-12">
      {/* Carousel */}
      <div className="w-full rounded-3xl overflow-hidden shadow-[4px_4px_4px_4px_rgba(0,0,0,0.4)] mb-12">
        <Carousel
          style={{ borderRadius: "20px" }}
          withIndicators
          className="max-h-[600px] h-auto lg:h-[600px]"
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.play}
          onMouseLeave={autoplay.current.reset}
          loop
          onClick={autoplay.current.reset}
          controlSize={40}
        >
          {stories?.map((story) => (
            <Carousel.Slide key={story.id}>
              <StoryCard story={story} title={false} status={false} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>

      {/* Trending */}
      <div>
        <div className="my-6 flex items-center">
          <p className="text-2xl font-bold">Trending</p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
            alt="trending"
            className="w-6 h-6 mx-6"
          />
        </div>
        <Carousel
          height={"auto"}
          slideSize={{ base: "50%", md: "33.333333%", lg: "25%" }}
          slideGap={{ base: "md", sm: "md" }}
          plugins={[autoplayItem.current]}
          onMouseEnter={autoplayItem.current.play}
          onMouseLeave={autoplayItem.current.reset}
          loop
          onClick={autoplayItem.current.reset}
          align={"start"}
          controlSize={40}
        >
          {trendingStories?.map((item) => (
            <Carousel.Slide key={item.id}>
              <StoryCard story={item} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>

      {/* đề cử */}
      <div>
        <div className="my-6 flex items-center">
          <p className="text-2xl font-bold">Đề cử</p>
          <img
            src="https://png.pngtree.com/png-vector/20221227/ourmid/pngtree-orange-cartoon-cute-flame-png-image_6510196.png"
            alt="trending"
            className="w-6 h-6 mx-2"
          />
        </div>
        <Carousel
          className="w-5/6 mx-auto"
          height={"auto"}
          slideSize={{ base: "50%", md: "33.333333%" }}
          slideGap={{ base: "md", sm: "md" }}
          plugins={[autoplayItem2.current]}
          onMouseEnter={autoplayItem2.current.play}
          onMouseLeave={autoplayItem2.current.reset}
          loop
          onClick={autoplayItem2.current.reset}
          align={"start"}
          controlSize={30}
        >
          {proposalStories?.map((item) => (
            <Carousel.Slide key={item.id}>
              <StoryCard story={item} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>

      {/* hiển thị các topics */}
      <div className="my-6 flex items-center">
        <p className="text-3xl font-bold">Các thể loại:</p>
      </div>
      <div>
        {topics?.map((topic) => (
          <>
            <div>
              <div className="my-6 flex items-center">
                <p className="text-2xl font-bold">{topic?.name}</p>
                <img
                  src="https://png.pngtree.com/png-vector/20221227/ourmid/pngtree-orange-cartoon-cute-flame-png-image_6510196.png"
                  alt="trending"
                  className="w-6 h-6 mx-2"
                />
              </div>
              {topic?.stories?.length > 0 ? (
                <Carousel
                  height={"auto"}
                  slideSize={{ base: "50%", md: "33.333333%", lg: "25%" }}
                  slideGap={{ base: "md", sm: "md" }}
                  loop
                  controlSize={40}
                  classNames={{
                    control: "w-10 h-10 -ml-2 -mr-2",
                  }}
                  align={"start"}
                  className="px-16"
                >
                  {topic?.stories?.map((item) => (
                    <Carousel.Slide key={item.id}>
                      <StoryCard story={item} />
                    </Carousel.Slide>
                  ))}
                </Carousel>
              ) : (
                <>
                  <div>
                    <Text
                      size="xl"
                      fw={"600"}
                      c={"black"}
                      className="text-center"
                    >
                      Hiện chưa có truyện nào thuộc thể loại này.
                    </Text>
                  </div>
                </>
              )}
            </div>
          </>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Button
          size={isLargeScreen ? "lg" : "sm"}
          color="yellow"
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          className="animate-bounce"
        >
          <p className="text-md lg:text-xl">Lên trên</p>
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
