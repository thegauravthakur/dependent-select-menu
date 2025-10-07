import { type Dispatch, type SetStateAction, useId } from "react";
import { useGetStates } from "./use-get-states.tsx";

interface StateInputProps {
    setActiveState: Dispatch<SetStateAction<string | null>>;
}

export function StateField({ setActiveState }: StateInputProps) {
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
                    aria-busy={loading}
                    aria-describedby={error ? `${stateInputId}-error` : undefined}
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
                {error && (
                    <p className="text-red-700" role="alert" id={`${stateInputId}-error`}>
                        Failed to fetch states: {error}
                    </p>
                )}
            </div>
        </div>
    );
}
