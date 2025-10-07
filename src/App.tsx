import { useDeferredValue, useState } from "react";
import { StateField } from "./state-field.tsx";
import { CityField } from "./city-field.tsx";

function App() {
    const [activeState, setActiveState] = useState<string | null>(null);
    const deferredState = useDeferredValue(activeState); // not as such required in this case

    return (
        <main className="mx-6 mt-10 flex flex-col gap-y-6 max-w-md md:mx-auto">
            <ul>
                <li>
                    <StateField setActiveState={setActiveState} />
                </li>
                <li>
                    {deferredState && <CityField activeState={deferredState} key={deferredState} />}
                </li>
            </ul>
        </main>
    );
}

export default App;
