import { useQuery } from "@tanstack/react-query";
import CommentService from "../services/CommentService.js";

export const useCommentsByStoryId = (storyId, page, limit = 10, orderBy = "time", isDesc = true) => {
    return useQuery({
        queryKey: ["comments", storyId, page, limit, orderBy, isDesc],
        queryFn: () => CommentService.getCommentByStoryId(storyId, page, limit, orderBy, isDesc),
        keepPreviousData: false
    })
};