import React from 'react';
import cl from './App.module.scss';
import weapons from "./weapons.json"
import McRoulette from "./Components/Roulette/McRoulette";


function App() {

    const weaponsCount = 150
    const transitionDuration = 10

    return (
        <div className={cl.App}>
            <div className={cl.wrapper}>
                <McRoulette
                    weapons={weapons}
                    weaponsCount={weaponsCount}
                    transitionDuration={transitionDuration}
                />
            </div>
        </div>
    );
}

export default App;
