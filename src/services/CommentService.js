import { instance } from "../lib/axios";

const CommentService = {
  async getCommentByStoryId(
    storyId,
    page,
    limit = 10,
    orderBy = "time",
    isDesc = true
  ) {
    const comments = await instance
      .get(`/comment/story/${storyId}`, {
        params: {
          storyId,
          page,
          limit,
          orderBy,
          isDesc,
        },
      })
      .then(({ data }) => {
        return data?.data;
      });
    return comments;
  },

  async addCommentByUserId(userId, storyId, chapterId, content) {
    const comment = await instance
      .post("/comment/user", {
        userId,
        storyId,
        chapterId,
        content,
      })
      .then((data) => data);
    return comment;
  },
};

export default CommentService;
