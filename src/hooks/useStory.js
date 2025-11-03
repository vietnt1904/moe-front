import { useQuery } from "@tanstack/react-query";
import StoryService from "../services/StoryService";

export const useStories = () => {
  return useQuery({
    queryKey: ["stories"],
    queryFn: () => StoryService.getStories(),
    keepPreviousData: false,
  });
};

export const useStory = (id, slug) => {
  return useQuery({
    queryKey: ["story", id, slug],
    queryFn: () => StoryService.getStoryById(id, slug),
    keepPreviousData: false,
  });
};

export const useStoriesByAuthor = (id) => {
  return useQuery({
    queryKey: ["storiesByAuthor", id],
    queryFn: () => StoryService.getStoriesSameAuthor(id),
    keepPreviousData: false,
  });
};

export const useStoriesSameAuthor = (id) => {
  return useQuery({
    queryKey: ["storiesSameAuthor", id],
    queryFn: () => StoryService.getStoriesByAuthor(id),
    keepPreviousData: false,
  });
};

export const useStoriesByUser = (id) => {
  return useQuery({
    queryKey: ["storiesByUser", id],
    queryFn: () => StoryService.getStoriesByUser(id),
    keepPreviousData: false,
  });
};

export const useStoriesByTopic = (id) => {
  return useQuery({
    queryKey: ["storiesByTopic", id],
    queryFn: () => StoryService.getStoriesByTopic(id),
    keepPreviousData: false,
  });
};

export const useStoriesAllTopics = () => {
  return useQuery({
    queryKey: ["storiesAllTopics"],
    queryFn: () => StoryService.getStoriesAllTopics(),
    keepPreviousData: false,
  });
};

export const useSearchStories = (page, limit, title, author) => {
  return useQuery({
    queryKey: ["searchStories", page, limit, title, author],
    queryFn: () => StoryService.searchStories(page, limit, title, author),
    keepPreviousData: false,
  });
};

export const useTrendingStories = () => {
  return useQuery({
    queryKey: ["trendingStories"],
    queryFn: () => StoryService.getTrendingStories(),
    keepPreviousData: false,
  });
};

export const useProposalStories = () => {
  return useQuery({
    queryKey: ["proposalStories"],
    queryFn: () => StoryService.getProposalStories(),
    keepPreviousData: false,
  });
};

export const useTop10Stories = () => {
  return useQuery({
    queryKey: ["top10Stories"],
    queryFn: () => StoryService.getTop10Stories(),
    keepPreviousData: false,
  });
};

export const useStoryFollowers = (id) => {
  return useQuery({
    queryKey: ["storyFollowers", id],
    queryFn: () => StoryService.getStoryFollowers(id),
    keepPreviousData: false,
  });
};

export const useBuyStory = (storyId) => {
  return useQuery({
    queryKey: ["buyStory", storyId],
    queryFn: () => StoryService.buyStory(storyId),
    keepPreviousData: false,
  });
};