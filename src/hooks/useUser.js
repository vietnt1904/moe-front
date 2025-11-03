import { useQuery } from "@tanstack/react-query";
import UserService from "../services/UserService";

export const useUser = (id) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => UserService.getUserById(id),
    keepPreviousData: true,
  });
};

export const useSaved = (userId, storyId) => {
  return useQuery({
    queryKey: ["saved", userId, storyId],
    queryFn: () => UserService.checkSaved(userId, storyId),
  });
};

export const useUserPaidStory = (userId, storyId) => {
  return useQuery({
    queryKey: ["userPaidStories", userId, storyId],
    queryFn: () => UserService.checkUserPaidStory(userId, storyId),
    keepPreviousData: true,
  });
};

export const useUserSubscribeStories = (userId) => {
  return useQuery({
    queryKey: ["userSubscribeStories", userId],
    queryFn: () => UserService.getUserSubscribeStories(userId),
    keepPreviousData: true,
  });
};

export const useUserSubStoriesOfAuthor = (userId, authorId) => {
  return useQuery({
    queryKey: ["userSubStoriesOfAuthor", userId, authorId],
    queryFn: () => UserService.getUserSubStoriesOfAuthor(userId, authorId),
    keepPreviousData: true,
  });
};

export const useUserHistory = (userId) => {
  return useQuery({
    queryKey: ["userHistory", userId],
    queryFn: () => UserService.getUserHistory(userId),
    keepPreviousData: true,
  });
};
