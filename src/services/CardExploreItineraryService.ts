import { apiClient } from "./api";

export interface ItineraryCard {
    id: number;
    title: string;
    description: string;
    province: string;
    startDate: string;
    endDate: string;
    photo: string;
    //rating?: string;
    durationDays: number;
    tags: string[];

}

export async function getItineraryCards(): Promise<ItineraryCard[]> {
    return apiClient
        .get("/itinerario/explorar")
        .then((r) => r.data);

}
