import { type Dispatch, type SetStateAction, useEffect, useId, useState } from "react";

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
    return data.data as string[];
}

function App() {
    const [activeState, setActiveState] = useState<string | null>(null);

    return (
        <div className="mx-6 mt-10 flex flex-col gap-y-6 max-w-md md:mx-auto">
            <StateInput setActiveState={setActiveState} />
            {activeState && <CityInput activeState={activeState} key={activeState} />}
        </div>
    );
}

interface StateInputProps {
    setActiveState: Dispatch<SetStateAction<string | null>>;
}

function StateInput({ setActiveState }: StateInputProps) {
    const { states, loading, error } = useGetStates();
    const stateInputId = useId();

    return (
        <div>
            <div className="flex items-center gap-x-4">
                <label htmlFor={stateInputId} className="font-semibold">
                    States
                </label>
                <select
                    className="rounded-md text-sm w-full"
                    name="state"
                    id={stateInputId}
                    defaultValue=""
                    onChange={(event) => {
                        setActiveState(event.target.value);
                    }}
                >
                    {loading ? (
                        <option value="" disabled>
                            loading...
                        </option>
                    ) : (
                        <option value="" disabled>
                            choose a value
                        </option>
                    )}
                    {states.map((state) => (
                        <option key={state.state_code}>{state.name}</option>
                    ))}
                </select>
            </div>
            <div className="mt-10">
                {error && <p className="text-red-700">Failed to fetch states: {error}</p>}
            </div>
        </div>
    );
}

interface CityInputProps {
    activeState: string;
}

function CityInput({ activeState }: CityInputProps) {
    const [activeCity, setActiveCity] = useState<string | null>(null);
    const { cities, loading, error } = useGetCities(activeState);

    const cityId = useId();

    return (
        <div>
            <div className="flex items-center gap-x-4">
                <label htmlFor={cityId} className="font-semibold">
                    Cities
                </label>
                <select
                    name="city"
                    id={cityId}
                    className="rounded-md text-sm w-full"
                    defaultValue=""
                    onChange={(event) => {
                        const city = event.target.value;
                        setActiveCity(city);
                    }}
                >
                    {loading ? (
                        <option value="" disabled>
                            loading...
                        </option>
                    ) : (
                        <option value="" disabled>
                            choose a value
                        </option>
                    )}
                    {cities.map((city) => (
                        <option key={city}>{city}</option>
                    ))}
                </select>
            </div>
            <div className="mt-10">
                {error && <p className="text-red-700">Error while fetching cities: {error}</p>}
                {activeState && activeCity && (
                    <p>
                        <span className="font-semibold">Selected State & City</span>: {activeState}{" "}
                        - {activeCity}
                    </p>
                )}
            </div>
        </div>
    );
}

type State = { name: string; state_code: string };

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

function useGetStates() {
    const [states, setStates] = useState<State[]>([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
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

function useGetCities(activeCityName: string | null) {
    const [cities, setCities] = useState<string[]>([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!activeCityName) return;
        const controller = new AbortController();
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

export default App;
