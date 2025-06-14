import { useQuery } from "@tanstack/react-query";
import StoryService from "../services/StoryService";

export const useStories = () => {
  return useQuery({
    queryKey: ["stories"],
    queryFn: () => StoryService.getStories(),
    keepPreviousData: true,
  });
};

export const useStory = (id, slug) => {
  return useQuery({
    queryKey: ["story", id, slug],
    queryFn: () => StoryService.getStoryById(id, slug),
    keepPreviousData: true,
  });
};

export const useStoriesByAuthor = (id) => {
  return useQuery({
    queryKey: ["storiesByAuthor", id],
    queryFn: () => StoryService.getStoriesSameAuthor(id),
    keepPreviousData: true,
  });
};

export const useStoriesSameAuthor = (id) => {
  return useQuery({
    queryKey: ["storiesSameAuthor", id],
    queryFn: () => StoryService.getStoriesByAuthor(id),
    keepPreviousData: true,
  });
};

export const useStoriesByUser = (id) => {
  return useQuery({
    queryKey: ["storiesByUser", id],
    queryFn: () => StoryService.getStoriesByUser(id),
    keepPreviousData: true,
  });
};

export const useStoriesByTopic = (id) => {
  return useQuery({
    queryKey: ["storiesByTopic", id],
    queryFn: () => StoryService.getStoriesByTopic(id),
    keepPreviousData: true,
  });
};

export const useStoriesAllTopics = () => {
  return useQuery({
    queryKey: ["storiesAllTopics"],
    queryFn: () => StoryService.getStoriesAllTopics(),
    keepPreviousData: true,
  });
};

export const useSearchStories = (page, limit, title, author) => {
  return useQuery({
    queryKey: ["searchStories", page, limit, title, author],
    queryFn: () => StoryService.searchStories(page, limit, title, author),
    keepPreviousData: true,
  });
};

export const useTrendingStories = () => {
  return useQuery({
    queryKey: ["trendingStories"],
    queryFn: () => StoryService.getTrendingStories(),
    keepPreviousData: true,
  });
};

export const useProposalStories = () => {
  return useQuery({
    queryKey: ["proposalStories"],
    queryFn: () => StoryService.getProposalStories(),
    keepPreviousData: true,
  });
};