import React, {useRef, useState} from 'react';
import cl from "./roulette.module.scss"
import RouletteItem from "./RouletteItem/RouletteItem";
import {Roulette, weaponAttributes} from "../../roulette.classes";

interface RouletteElementParams {
    weapons: weaponAttributes[],
    weaponsCount: number,
    transitionDuration: number
}

const McRoulette = ({
                             weapons,
                             weaponsCount,
                             transitionDuration
                         }: RouletteElementParams) => {

    const [rouletteWeapons, setRouletteWeapons] = useState<weaponAttributes[]>(weapons)
    const [weaponPrizeId, setWeaponPrizeId] = useState<number>(-1)
    const [isReplay, setIsReplay] = useState<boolean>(false)
    const [isSpin, setIsSpin] = useState<boolean>(false)
    const [isSpinEnd, setIsSpinEnd] = useState<boolean>(false)
    const [winHistory, setWinHistory] = useState<weaponAttributes[]>([])

    const rouletteContainerRef = useRef<HTMLDivElement>(null)
    const weaponsRef = useRef<HTMLDivElement>(null)

    function transitionEndHandler() {
        setWinHistory(winHistory.concat(rouletteWeapons[weaponPrizeId]))
        setIsSpin(false)
        setIsSpinEnd(true)
    }

    function prepare() {
        weaponsRef.current!.style.transition = "none"
        weaponsRef.current!.style.left = "0px"
    }

    function load() {
        let winner = weapons[Math.floor(Math.random() * weapons.length)];

        const roulette = new Roulette({
            winner,
            weapons,
            rouletteContainerRef,
            weaponsRef,
            weaponsCount: weaponsCount,
            transitionDuration: transitionDuration
        });

        roulette.set_weapons()
        setRouletteWeapons(roulette.weapons)

        return roulette
    }

    function play() {
        if (isReplay) {
            prepare()
        }
        setIsSpin(true)

        const roulette = load()

        setTimeout(() => {
            setIsSpin(true)
            setWeaponPrizeId(roulette.spin())
            setIsReplay(true)
        }, 1000)
    }

    return (
        <div>
            <div className={cl.rouletteWrapper}>
                <div ref={rouletteContainerRef}>
                    <div className={cl.evRoulette}>
                        <div className={cl.evTarget}></div>
                        <div ref={weaponsRef} className={cl.evWeapons} onTransitionEnd={transitionEndHandler}>
                            {rouletteWeapons.map((w, i) => {
                                return <RouletteItem
                                    key={i}
                                    id={i}
                                    isLoser={(i !== weaponPrizeId) && !isSpin && isSpinEnd}
                                    weapon_name={w.weapon_name}
                                    skin_name={w.skin_name}
                                    rarity={w.rarity}
                                    steam_image={w.steam_image}
                                />
                            })}
                        </div>
                    </div>
                </div>
                <button className={cl.button} disabled={isSpin} onClick={play}>Roll</button>
            </div>
        </div>
    );
};

export default McRoulette;