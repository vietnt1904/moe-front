import { instance } from "../lib/axios";

const RateService = {
  async getRatesByStoryId(storyId) {
    const rates = await instance
      .get("/rate", {
        params: {
          storyId: storyId,
        },
      })
      .then((data) => {
        data;
      });
    return rates;
  },

  async addRateByStoryId(userId, storyId, star, review) {
    const rate = await instance
      .post("/rate/user", {
          userId,
          storyId,
          star,
          review,
      })
      .then((data) => data);
    return rate;
  },

  async getRateByUserId(userId, storyId) {
    const rates = await instance
      .get(`/rate/${storyId}`, {
        params: {
          userId,
        },
      })
      .then((data) => data);
    return rates;
  },

  async updateRateByStoryId(userId, storyId, star, review) {
    const rate = await instance
      .put("/rate", {
          userId,
          storyId,
          star,
          review,
      })
      .then((data) => data);
    return rate;
  },
};

export default RateService;
