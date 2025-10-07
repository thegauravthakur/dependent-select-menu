import { useEffect, useState } from "react";

export type State = { name: string; state_code: string };

async function fetchStates(abortController: AbortController) {
    const response = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: "United States" }),
        signal: abortController.signal,
    });
    const data = await response.json();
    return data.data.states as State[];
}

export function useGetStates() {
    const [states, setStates] = useState<State[]>([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        setStates([]);
        setError(null);
        setLoading(true);

        fetchStates(controller)
            .then((states) => {
                setStates(states);
                setLoading(false);
            })
            .catch((error) => {
                if (error.name !== "AbortError") {
                    setError(error);
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, []);

    return { states, error, loading };
}
