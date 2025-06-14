import { jwtDecode } from "jwt-decode";
import { authInstance } from "../lib/axios";

const AuthService = {
    async login(email, password) {
        const res = await authInstance
            .post("/auth/login", {
                email,
                password,
            })
            .then(({ data }) => {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                return data;
            });
        return res;
    },

    async signup (data) {
        const res = await authInstance
            .post("/auth/signup", data)
            .then(({ data }) => {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                return data?.user;
            });
        return res;
    },

    async logout() {
        localStorage.removeItem("token");
    },


    async changePassword(userId, password, newPassword) {
        const data = authInstance.post("/users/changePassword/operator").then(({ data }) => {
            return data;
        });
        return data;
    },
    async getAccountInfo() {
        const token = localStorage.getItem("token");
        console.log(token);
        const operatorData = jwtDecode(token);
        const { email } = operatorData.email;

        console.log(email);

        const accontInfo = authInstance.get("/users/getUserByEmail", { email }).then(({ data }) => {
            return data;
        });
        return accontInfo;
    },
    async resetPassword(email, role) {
        const data = authInstance.post("/auth/reset-password", {
            email, role
        }).then(({ data }) => {
            return data;
        });
        return data;
    }
};

export default AuthService;

//AuthService.getAccountInfo()
