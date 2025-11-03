import { useQuery } from "@tanstack/react-query";
import BannerService from "../services/BannerService";

export const useBanners = () => {
    return useQuery({
        queryKey: ["banners"],
        queryFn: () => BannerService.getBanners(),
    });
};