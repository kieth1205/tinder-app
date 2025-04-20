import api from "@/services/api";
import { UserSuggestion } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useGetMatches = () => {
    const query = useQuery({
        queryKey: ['matches'],
        queryFn: async () => {
            const response = await api.get<UserSuggestion[]>('/suggestions');
            return response.data;
        },
    });
    return query;
}
