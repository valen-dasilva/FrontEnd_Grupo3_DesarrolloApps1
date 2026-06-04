import { useEffect, useState } from "react";
import { getItineraryCards, ItineraryCard } from "../src/services/CardExploreItineraryService";

export const useItinerariesCards = () => {
    const [itineraries, setItineraries] = useState<ItineraryCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getItineraryCards()
            .then(setItineraries)
            .catch((err) => { setError(err.message ?? "Error al cargar itinerarios") })
            .finally(() => { setLoading(false) });
    }, []);

    return { itineraries, loading, error };
};