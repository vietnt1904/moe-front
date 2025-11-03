import { instance } from "../lib/axios";

const BannerService = {
    async getBanners() {
        const banners = await instance
            .get("/banner/all")
            .then(({ data }) => data);
        return banners;
    },
}

export default BannerService;