import {Ref} from "react";

export interface weaponAttributes {
    weapon_name: string,
    skin_name: string
    rarity: string
    steam_image: string,
}

// КЛАСС ОРУЖИЯ
export class Weapon {
    id: number
    weapon_name: string
    skin_name: string
    rarity: string
    steam_image: string

    constructor(id: number, attrs: weaponAttributes) {
        this.id = id;

        // атрибуты с сервера
        this.weapon_name = attrs.weapon_name;
        this.skin_name = attrs.skin_name;
        this.rarity = attrs.rarity;
        this.steam_image = attrs.steam_image;
    }

}

export interface rouletteAttributes {
    winner: weaponAttributes
    weapons: weaponAttributes[]

    rouletteContainerRef: Ref<HTMLElement>
    weaponsRef: Ref<HTMLElement>

    weaponsCount?: number
    transitionDuration?: number
    itemWidth?: number
}

// КЛАСС РУЛЕТКИ
export class Roulette {

    winner: weaponAttributes
    allWeapons: weaponAttributes[]

    rouletteWrapper: Ref<HTMLElement>
    weaponWrapper: Ref<HTMLElement>

    weapons: Weapon[]

    weaponsCount: number
    weaponPrizeId: number

    transitionDuration: number

    itemWidth: number

    constructor(attrs: rouletteAttributes) {
        // атрибуты для генерации массива weapons
        this.winner = attrs.winner;
        this.allWeapons = attrs.weapons;

        // тут будет всё оружие (оружие-приз + оружие-актёры)
        this.weapons = [];

        // родительский DOM-элемент для рулетки
        this.rouletteWrapper = attrs.weaponsRef;

        // родительский DOM-элемент для DOM-элементов оружия (он вращается)
        this.weaponWrapper = attrs.weaponsRef;

        // общее количество оружия
        this.weaponsCount = attrs.weaponsCount || 50;

        // id приза
        this.weaponPrizeId = this.randomRange(this.weaponsCount / 2, this.weaponsCount - 5)

        this.transitionDuration = attrs.transitionDuration || 10

        this.itemWidth = attrs.itemWidth || 200
    }

    private randomRange = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private shuffle = (array: any[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    set_weapons = () => {
        let weapons: Weapon[] = [] // объявляем массив оружия
        let weapon_actors_len = this.allWeapons.length  // количество оружия пришедшее с бд

        const set_weapon_actors = (from_i: number, to_i: number) => {
            let j = 0
            const createdWeapons: Weapon[] = []
            for (let i = from_i; i <= to_i; i += 1) {
                // создаем оружие с индексом i и атрибутами j
                createdWeapons.push(new Weapon(i, this.allWeapons[j]))
                j = (j === weapon_actors_len - 1) ? 0 : j + 1;
            }
            this.shuffle(createdWeapons)
            return createdWeapons
        };

        // нет оружия с бд - ошибка
        if (weapon_actors_len === 0) {
            throw new Error('Ошибка! Нет актёров.');
        }

        /**
         * сетаем оружия в размере количества
         *  оружия в рулетке с 0 до id приза
         */
        weapons = weapons.concat(set_weapon_actors(0, this.weaponPrizeId - 1))

        // создаем оружие приз
        weapons[this.weaponPrizeId] = new Weapon(this.weaponPrizeId, this.winner);

        /** сетаем оружия в id приза до конца */
        weapons = weapons.concat(set_weapon_actors(this.weaponPrizeId + 1, this.weaponsCount - 1))
        this.weapons = weapons;
    };

    /** ВРАЩЕНИЕ РУЛЕТКИ
     -----------------------------------------------------------------------------*/
    spin = () => {
        let el_weapon_width_1_2 = Math.floor(this.itemWidth / 2)
        let el_weapon_width_1_20 = Math.floor(this.itemWidth / 20)

        // рандомная координата остановки
        const randStop = (this.weaponPrizeId - 4) * this.itemWidth +
            el_weapon_width_1_2 +
            this.randomRange(el_weapon_width_1_20, (18 * el_weapon_width_1_20))

        // анимация теперь через 'transition', а не через 'animation'
        // 'ease-out' -- это плавное замедление рулетки
        // @ts-ignore
        this.weaponWrapper.current.style.transition = `left ${this.transitionDuration}s ease-out`;

        // немного отложенный старт
        // (ибо нельзя сразу установить css-свойство 'left')
        setTimeout(() => {
            // @ts-ignore
            this.weaponWrapper!.current.style.left = `-${randStop}px`;
        }, 100);

        return this.weaponPrizeId
    }
}
