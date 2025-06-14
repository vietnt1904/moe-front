import { useQuery } from "@tanstack/react-query";
import UserService from "../services/UserService";

export const useUser = (id) => {
    return useQuery({
        queryKey: ["user", id],
        queryFn: () => UserService.getUserById(id),
        keepPreviousData: true,
    });
};