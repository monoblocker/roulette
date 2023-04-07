import React from 'react';
import cl from "./RouletteItem.module.scss"

interface rouletteItemProps {
    id: number,
    weapon_name: string,
    skin_name: string,
    rarity: string
    steam_image: string,
    isLoser: boolean
}

const RouletteItem = ({
                          id,
                          weapon_name,
                          skin_name,
                          rarity,
                          steam_image,
                          isLoser
                      }: rouletteItemProps) => {
    return (
        <div className={cl.evWeapon} style={isLoser ? {opacity: "0.5"} : {opacity: "1"}}>
            <div className={`${cl.evWeaponInner}`} id={String(id)}>
                <div className={`${cl.evWeaponRarity} ${cl[rarity]}`}></div>
                <img src={steam_image} alt={weapon_name}/>
                <div className={cl.evWeaponText}>
                    <p>{weapon_name}</p>
                    <p>{skin_name}</p>
                </div>
            </div>
        </div>
    );
};

export default RouletteItem;