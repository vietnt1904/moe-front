import { instance } from "../lib/axios";

const StoryService = {
  async getStories(page = 1, limit = 10) {
    const stories = await instance
      .get("/story", {
        params: {
          page: page,
          limit: limit,
        },
      })
      .then(({ data }) => data);
    return stories;
  },

  async getStoryById(id, slug) {
    const story = await instance
      .get(`/story/${slug}-${id}`)
      .then(({ data }) => data?.data);
    return story;
  },

  async buyStory(id) {
    const story = await instance
      .get(`/story/buy/${id}`)
      .then(({ data }) => data?.data);
    return story;
  },

  async getStoriesSameAuthor(id) {
    const stories = await instance
      .get(`/story/author/${id}`)
      .then(({ data }) => data);
    return stories;
  },

  async getStoriesByAuthor(id) {
    const stories = await instance
      .get(`/story/author/${id}`)
      .then(({ data }) => data?.data);
    return stories;
  },

  async getStoriesByUser(id) {
    const stories = await instance
      .get(`/story/author/${id}`)
      .then(({ data }) => data?.data);
    return stories;
  },

  async getStoriesByTopic(id) {
    const stories = await instance
      .get(`/story/topic/${id}`)
      .then(({ data }) => data?.data);
    return stories;
  },

  async getStoriesAllTopics() {
    const stories = await instance
      .get(`/story/topics`)
      .then(({ data }) => data?.data);
    return stories;
  },

  async searchStories(page, limit, title, author) {
    const stories = await instance
      .get(`/story/search`, {
        params: {
          page: page,
          limit: limit,
          title: title,
          author: author,
        },
      })
      .then(({ data }) => data?.data);
    return stories;
  },

  async writeStory(data) {
    const story = await instance
      .post("/story/writestory", data)
      .then(({ data }) => data);
    return story;
  },

  async updateStory (id, data) {
    const story = await instance
        .put(`/story/update/${id}`, data)
        .then(({ data }) => data);
    return story;
  },

  async getTrendingStories() {
    const stories = await instance
      .get(`/story/trending`)
      .then(({ data }) => data?.data);
    return stories;
  },

  async getProposalStories() {
    const stories = await instance
      .get(`/story/proposal`)
      .then(({ data }) => data?.data);
    return stories;
  },

  async getStoryFollowers(id) {
    const followers = await instance
      .get(`/story/followers/${id}`)
      .then(({ data }) => data?.data || 0);
    return followers;
  },

  async getTop10Stories() {
    const stories = await instance
      .get(`/story/ranking`)
      .then(({ data }) => data?.data);
    return stories;
  },
};

export default StoryService;
