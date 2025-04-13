import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export const useGetMatches = () => {
    const query = useQuery({
        queryKey: ['matches'],
        queryFn: async () => {
            const response = await api.get('/users/matches');
            return response.data;
        },
    });
    return query;
}
