import { useQuery } from "@tanstack/react-query";
import UserService from "../services/UserService";

export const useAuthor = (authorId) => {
    return useQuery({
        queryKey: ["author", authorId],
        queryFn: () => UserService.getUserById(authorId),
    });
};

export const useFollowersOfAuthor = (authorId) => {
    return useQuery({
        queryKey: ["followersOfAuthor", authorId],
        queryFn: () => UserService.getFollowersOfAuthor(authorId),
    });
};

export const useAuthorStories = (authorId) => {
    return useQuery({
        queryKey: ["authorStories", authorId],
        queryFn: () => UserService.getAuthorStories(authorId),
    });
};

export const useStoryByIdOfAuthor = (id, slug) => {
    return useQuery({
        queryKey: ["storyByIdOfAuthor", id, slug],
        queryFn: () => UserService.getStoryByIdOfAuthor(id, slug),
    });
}