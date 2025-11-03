import { useQuery } from "@tanstack/react-query";
import NotificationService from "../services/NotificationService.js";

export const useAllNotifications = (id) => {
    return useQuery({
        queryKey: ["notification", id],
        queryFn: () => NotificationService.getAllNotifications(id),
        keepPreviousData: false,
    });
};

export const useUnreadNotifications = (id) => {
    return useQuery({
        queryKey: ["unreadNotification", id],
        queryFn: () => NotificationService.getUnreadNotifications(id),
        keepPreviousData: false,
    });
};