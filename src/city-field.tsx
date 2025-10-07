import { useId, useState } from "react";
import { useGetCities } from "./use-get-cities.tsx";

interface CityInputProps {
    activeState: string;
}

export function CityField({ activeState }: CityInputProps) {
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
                    aria-busy={loading}
                    aria-describedby={error ? `${cityId}-error` : undefined}
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
                {error && (
                    <p className="text-red-700" id={`${cityId}-error`} role="alert">
                        Error while fetching cities: {error}
                    </p>
                )}
                {activeState && activeCity && (
                    <p role="alert">
                        <span className="font-semibold">Selected State & City</span>: {activeState}{" "}
                        - {activeCity}
                    </p>
                )}
            </div>
        </div>
    );
}
