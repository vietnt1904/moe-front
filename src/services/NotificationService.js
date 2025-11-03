import { instance } from "../lib/axios";

const NotificationService = {
    async getAllNotifications(id) {
        const notifications = await instance
            .get(`/user/notification/all/${id}`)
            .then(({ data }) => data?.data);
        return notifications;
    },

    async getUnreadNotifications (id) {
        if (!id) return 0;
        const notifications = await instance
            .get(`/user/notification/unread/${id}`)
            .then(({ data }) => data?.data);
        return notifications;
    },

    async changeIsReadStatus(id, data) {
        const notifications = await instance
            .patch(`/user/notification/${id}`, data)
            .then(({ data }) => data?.data);
        return notifications;
    },

    async readAllNotifications(id) {
        const notifications = await instance
            .patch(`/user/notification/all/${id}`)
            .then(({ data }) => data?.data);
        return notifications;
    },
};

export default NotificationService;