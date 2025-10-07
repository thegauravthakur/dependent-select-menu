import { useEffect, useState } from "react";

async function fetchCities(stateName: string, controller: AbortController) {
    const response = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            country: "United States",
            state: stateName,
        }),
        signal: controller.signal,
    });
    const data = await response.json();
    return (data?.data as string[]) ?? [];
}

export function useGetCities(activeCityName: string | null) {
    const [cities, setCities] = useState<string[]>([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!activeCityName) return;
        const controller = new AbortController();

        setCities([]);
        setError(null);
        setLoading(true);

        fetchCities(activeCityName, controller)
            .then((states) => {
                setCities(states);
                setLoading(false);
            })
            .catch((error) => {
                if (error.name !== "AbortError") {
                    setError(error);
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [activeCityName]);

    return { cities, error, loading };
}
