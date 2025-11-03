import { instance } from "../lib/axios";

const UserService = {
  async getUserById(id) {
    const user = await instance
      .get(`/user/${id}`)
      .then(({ data }) => data?.user);
    return user;
  },

  async updatepInfor(id, data) {
    const user = await instance
      .patch(`/user/update/${id}`, data)
      .then(({ data }) => data);
    return user;
  },

  async addHistory(id, data) {
    const user = await instance
      .post(`/user/history/${id}`, data)
      .then(({ data }) => data);
    return user;
  },

  async checkSaved(userId, storyId) {
    if (!userId || !storyId) return false;
    const saved = await instance
      .get(`/user/saved/story/${userId}`, {
        params: { userId: userId, storyId: storyId },
      })
      .then(({ data }) => data?.data?.isSave || false);
    return saved;
  },

  async updateSaveStory(userId, storyId, isSave) {
    const saved = await instance
      .post(`/user/saved/story/${userId}`, {
        userId: userId,
        storyId: storyId,
        isSave: isSave,
      })
      .then(({ data }) => data?.data);
    return saved;
  },

  async checkUserPaidStory(userId, storyId) {
    if (!userId || !storyId) return false;
    const paid = await instance
      .get(`/user/paid/${userId}`, {
        params: { userId: userId, storyId: storyId },
      })
      .then(({ data }) => data?.data?.isPaid || false);
    return paid;
  },
  async getFollowersOfAuthor(authorId) {
    const followers = await instance
      .get(`/author/followers/${authorId}`)
      .then(({ data }) => data?.data);
    return followers;
  },

  async getUserSubscribeStories(userId) {
    if (!userId) return false;
    const stories = await instance
      .get(`/user/saved/all/${userId}`)
      .then(({ data }) => data?.data);
    return stories;
  },

  async getUserHistory(userId) {
    if (!userId) return false;
    const stories = await instance
      .get(`/user/history/all/${userId}`)
      .then(({ data }) => data?.data);
    return stories;
  },

  async getAuthorStories(authorId) {
    return instance
      .get(`/author/story/all/${authorId}`)
      .then(({ data }) => data?.data);
  },

  async getStoryByIdOfAuthor(id, slug) {
    return instance
      .get(`/author/story/${slug}-${id}`)
      .then(({ data }) => data?.data);
  },

  async changePassword(userId, data) {
    const user = await instance
      .patch(`/user/changePassword/${userId}`, data)
      .then(({ data }) => data);
    return user;
  },

  async getUserSubStoriesOfAuthor(userId, authorId) {
    if (!userId || !authorId) return false;
    const stories = await instance
      .get(`/user/story/subscribe/${userId}`, {
        params: { userId: userId, authorId: authorId },
      })
      .then(({ data }) => data?.data);
    return stories;
  },

  async buyStory(userId, storyId, price) {
    if (!userId || !storyId) return false;
    const stories = await instance
      .post(`/user/buy/${userId}`, { userId: userId, storyId: storyId, spiritStones: price })
      .then(({ data }) => data?.data);
    return stories;
  },

  async userSubscribeAuthor(userId, authorId, isSubscribe) {
    if (!userId || !authorId) return false;
    const stories = await instance
      .post(`/user/subscribe/${userId}`, { authorId: authorId, isSubscribe: isSubscribe })
      .then(({ data }) => data?.data);
    return stories;
  },
};

export default UserService;
