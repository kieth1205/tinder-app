import api from "@/services/api";
import { UserSuggestion } from "@/types";
import { useQuery } from "@tanstack/react-query";
import locationService from "@/services/locationService";
import { getUsersByInterest } from "@/services/interestService";

export const useGetMatches = () => {
    const query = useQuery({
        queryKey: ['matches'],
        queryFn: async () => {
            try {
                const location = await locationService.getCurrentLocation();
                if (location) {
                    await locationService.updateUserLocation(location);
                }
                const response = await api.get<UserSuggestion[]>('/suggestions');
                return response.data;
            } catch (error) {
                console.error('Error with location:', error);
                const response = await api.get<UserSuggestion[]>('/suggestions');
                return response.data;
            }
        },
    });
    return query;
}

export const updateUserLocation = async (): Promise<boolean> => {
    try {
        const location = await locationService.getCurrentLocation();
        if (location) {
            console.log("location", location)
            return await locationService.updateUserLocation(location);
        }
        return false;
    } catch (error) {
        console.error('Error updating user location:', error);
        return false;
    }
}

export const useGetInterestMatches = (interestId?: string) => {
    const query = useQuery({
        queryKey: ['interest-matches', interestId],
        queryFn: async () => {
            if (!interestId) return;

            const response = await getUsersByInterest(interestId);
            return response;
        },
        enabled: !!interestId,
    });
    return query;
}

export const useGetUserDetail = (userId: string) => {
    const query = useQuery({
        queryKey: ['user-detail', userId],
        queryFn: async () => {
            const response = await api.get<UserSuggestion>(`/users/${userId}`);
            return response.data;
        },
        enabled: !!userId,
    });
    return query;
}