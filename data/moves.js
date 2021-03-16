/**
 * @type {Object.<string, Move>}
 */
const moves = 
{
    tackle: {
        name: "Tackle",
        desc: "A physical attack in which the user charges and slams into the target with its whole body.",
        type: "Normal",
        basePower: 40,
        accuracy: 100,
        category: "Physical",
        pp: 35,
        flags: {contact: true, protect: true},
        target: "normal"
    },
    quickattack: {
        name: "Quick Attack",
        desc: "Lets the user get in the first hit.",
        type: "Normal",
        basePower: 40,
        accuracy: 100,
        category: "Physical",
        pp: 30,
        flags: {contact: true, protect: true},
        target: "normal",
        priority: 1
    },
    headbutt: {
        name: "Headbutt",
        desc: "The user sticks out its head and attacks by charging straight into the target. This may also make the target flinch.",
        type: "Normal",
        basePower: 70,
        accuracy: 100,
        category: "Physical",
        pp: 15,
        flags: {contact: true, protect: true},
        target: "normal",
    },
    flareblitz: {
        name: "Flare Blitz",
        desc: "Flare Blitz inflicts damage, and the user receives recoil damage equal to ⅓ of the damage done to the target.",
        type: "Fire",
        basePower: 120,
        accuracy: 100,
        category: "Physical",
        pp: 15,
        flags: {contact: true, protect: true},
        target: "normal",
        recoil: [33, 100]
    },
    thundershock: {
        name: "Thunder Shock",
        desc: "A physical attack in which the user charges and slams into the target with its whole body.",
        type: "Electric",
        basePower: 40,
        accuracy: 100,
        category: "Special",
        pp: 30,
        flags: {contact: false, protect: true},
        target: "normal"
    },
    electroball: {
        name: "Electro Ball",
        desc: "Electro Ball inflicts more damage the faster the user is compared to the opponent",
        type: "Electric",
        basePower: 0,
        accuracy: 100,
        category: "Special",
        pp: 30,
        onBasePower(source, target)
        {
            // r = UserSpeed ÷ TargetSpeed
            let ratio = source.baseStats.spe / target.baseStats.spe;
            if(4 <= ratio) return 150;
            else if(3 <= ratio) return 120;
            else if(2 <= ratio) return 80;
            else if(1 <= ratio) return 60;
            else if(ratio < 1) return 40;
        },
        flags: {contact: false, protect: true},
        target: "normal"
    },
    ember: {
        name: "Ember",
        desc: "The target is attacked with small flames. This may also leave the target with a burn.",
        type: "Fire",
        basePower: 40,
        accuracy: 100,
        category: "Special",
        pp: 30,
        flags: {contact: false, protect: true},
        target: "normal"
    },
    inferno: {
        name: "Inferno",
        desc: "The target is attacked with small flames. This may also leave the target with a burn.",
        type: "Fire",
        basePower: 100,
        accuracy: 50,
        category: "Special",
        pp: 5,
        flags: {contact: false, protect: true},
        target: "normal"
    }
}

class Move
{
    /**
     * Display name of the move
     * @type {string}
     */
    name;
    /**
     * Small move description
     * @type {string}
     */
    desc;
    /**
     * @type {"Normal" | "Fire" | "Fighting" | "Water" | "Flying" | "Grass" | "Poison" | "Electric" | "Ground" | "Psychic" | "Rock" | "Ice" | "Bug" | "Dragon" | "Ghost" | "Dark" | "Steel" | "Fairy" | "???"}
     */
    type;
    /**
     * Base power of the move
     * @type {number}
     */
    basePower;
    /**
     * % of accuracy the move has; Set to true to not check accuracy
     * @type {number}
     */
    accuracy;
    /**
     * Move category
     * @type {"Physical" | "Special" | "Status"}
     */
    category;
    /**
     * The amount of times the move can be uses;
     * @type {number | boolean}
     */
    pp;
    /**
     * if our move has prority
     * @type {number}
     */
    priority = 0;
    /**
     * Recoil damage; num1 of num2 of damage delt; Set null for no recoil damage
     * @type {Array<string>}
     */
    recoil = null;
    /**
     * @type {{contact: boolean, protect: boolean}}
     */
    flags = {contact: false, protect: true};
    /**
     * The secondaary effects that can happen
     * @type {{chance: number, status: string, boosts: {atk: number, def: number, spa: number, spd: number, spe: number}}}
     */
    secondary = null;
    /**
     * The moves target
     * @type {"normal" | "self"}
    */
    target;

    /** Events */
    /**
     * 
     * @param {Pokemon} source 
     * @param {Pokemon} target 
     */
    onBasePower(source, target){return null}
    /**
     * 
     * @param {Pokemon} source 
     * @param {Pokemon} target 
     */
    getBasePower(source, target)
    {
        return this.onBasePower() || this.basePower(source, target);
    }
}