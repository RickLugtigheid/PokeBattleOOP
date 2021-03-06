/**
 * @type {Object.<string, Move>}
 */
module.exports.moves = 
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
        target: "normal",
        priority: 0
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
        priority: 0
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
        recoil: .33,
        priority: 0
    },
    razorleaf: {
        name: "Razor Leaf",
        desc: "Sharp-edged leaves are launched to slash at opposing Pokémon.",
        type: 'Grass',
        basePower: 55,
        accuracy: 100,
        category: "Physical",
        pp: 25,
        flags: {contact: false, protect: true},
        target: "normal",
        priority: 0
    },
    seedbomb: {
        name: "Razor Leaf",
        desc: "The user slams a barrage of hard-shelled seeds down on the target from above.",
        type: 'Grass',
        basePower: 80,
        accuracy: 100,
        category: "Physical",
        pp: 15,
        flags: {contact: false, protect: true},
        target: "normal",
        priority: 0
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
        target: "normal",
        priority: 0
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
        target: "normal",
        priority: 0
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
        target: "normal",
        priority: 0
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
        target: "normal",
        priority: 0
    },
    watergun: {
        name: "Water Gun",
        desc: "The target is blasted with a forceful shot of water.",
        type: "Water",
        basePower: 40,
        accuracy: 100,
        category: "Special",
        pp: 25,
        flags: {contact: false, protect: true},
        target: "normal",
        priority: 0
    },
    hydropump: {
        name: "Hydro Pump",
        desc: "The target is blasted by a huge volume of water launched under great pressure.",
        type: "Water",
        basePower: 110,
        accuracy: 80,
        category: "Special",
        pp: 5,
        flags: {contact: false, protect: true},
        target: "normal",
        priority: 0
    },
    flashcannon: {
        name: "Flash Cannon",
        desc: "The user gathers all its light energy and releases it all at once.",
        type: "Steel",
        basePower: 80,
        accuracy: 100,
        category: "Special",
        pp: 10,
        flags: {contact: false, protect: true},
        target: "normal",
        priority: 0
    },
    sludgebomb: {
        name: "Sludge Bomb",
        desc: "Unsanitary sludge is hurled at the target.",
        type: "Poison",
        basePower: 90,
        accuracy: 100,
        category: "Special",
        pp: 10,
        flags: {contact: false, protect: true},
        target: "normal",
        priority: 0
    },
    earthquake: {
        name: "Earthquake",
        desc: "A powerful quake, but has no effect on flying foes.",
        type: "Ground",
        basePower: 100,
        accuracy: 100,
        category: "Physical",
        pp: 10,
        flags: {contact: false, protect: true},
        target: "normal",
        priority: 0
    },
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
     * Recoil damage; % of damage to deal of delt damage; Set null for no recoil damage
     * @type {int}
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

    /**
     * @param {Move} moveObj 
     */
    constructor(moveObj)
    {
        this.accuracy = moveObj.accuracy;
        this.basePower = moveObj.basePower;
        this.category = moveObj.category;
        this.desc = moveObj.desc;
        this.flags = moveObj.flags;
        this.name = moveObj.name;
        this.onBasePower = moveObj.onBasePower;
        this.pp = moveObj.pp;
        this.priority = moveObj.priority;
        this.recoil = moveObj.recoil;
        this.secondary = moveObj.secondary;
        this.target = moveObj.target;
        this.type = moveObj.type;

        this.curentPP = this.pp;
    }

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
        if(typeof this.onBasePower == 'function') return this.onBasePower(source, target);
        return this.basePower;
    }
    doesHit()
    {
        if(typeof this.accuracy == "boolean") return this.accuracy;
        
        // Random % chance the it
        const random = Math.floor(Math.random() * 100) + 1; // returns a random integer from 1 to 100
        return random <= this.accuracy;
    }
}
module.exports.Move = Move;