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
            .patch(`/user/${id}`, data)
            .then(({ data }) => data?.user);
        return user;
    },

};

export default UserService;