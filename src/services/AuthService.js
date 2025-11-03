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

    async getSession() {
    const payload = authInstance.get("/adminauth/session").then(({ data }) => {
      return data;
    });
    return payload;
  },

    async signup (data) {
        const res = await authInstance
            .post("/auth/signup", data)
            .then((data) => {
                return data;
            });
        return res;
    },

    async logout() {
        localStorage.removeItem("token");
    },


    // async changePassword(userId, password, newPassword) {
    //     const data = authInstance.post("/users/changePassword/operator").then(({ data }) => {
    //         return data;
    //     });
    //     return data;
    // },
    async getAccountInfo() {
        const token = localStorage.getItem("token");
        const operatorData = jwtDecode(token);
        const { email } = operatorData.email;


        const accontInfo = authInstance.get("/user/getUserByEmail", { email }).then(({ data }) => {
            return data;
        });
        return accontInfo;
    },
    async resetPassword(email, password) {
        const data = authInstance.post("/auth/reset-password", {
            email, password
        }).then(({ data }) => {
            return data;
        });
        return data;
    },

    async forgetPassword(email) {
        const data = authInstance.post("/auth/forget-password", {
            email
        }).then(( data ) => {
            return data;
        });
        return data;
    },

    async verifyOTP(email, otp) {
        const data = authInstance.post("/auth/verify-otp", {
            email, otp
        }).then((data) => {
            return data;
        });
        return data;
    },

    async signupData (data) {
        const res = await authInstance
            .post("/auth/signupdata", data)
            .then((data) => {
                localStorage.setItem("token", data?.token);
                localStorage.setItem("user", JSON.stringify(data?.user));
                return data;
            });
        return res;
    },


};

export default AuthService;

//AuthService.getAccountInfo()
