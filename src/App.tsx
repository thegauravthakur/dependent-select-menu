import { useState } from "react";
import { StateField } from "./state-field.tsx";
import { CityField } from "./city-field.tsx";

function App() {
    const [activeState, setActiveState] = useState<string | null>(null);

    return (
        <main className="mx-6 mt-10 flex flex-col gap-y-6 max-w-md md:mx-auto">
            <ul>
                <li>
                    <StateField setActiveState={setActiveState} />
                </li>
                <li>{activeState && <CityField activeState={activeState} key={activeState} />}</li>
            </ul>
        </main>
    );
}

export default App;
