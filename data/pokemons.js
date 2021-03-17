const {Move} = require('./moves');
/**
 * @type {Object.<string, Pokemon>}
 */
module.exports.dex =
{
    pikachu: {
        name: "Pikachu",
        types: ["Electric"],
        baseStats: {hp: 35, atk: 55, def: 40, spa: 50, spd: 50, spe: 90}
    },
    charmeleon: {
        name: "Charmeleon",
        types: ["Fire"],
        baseStats: {hp: 58, atk: 64, def: 58, spa: 80, spd: 65, spe: 80}
    }
}

module.exports.Pokemon = class
{
    /** Default Set Values */
    /**
     * Name of the pokemon
     * @type {string}
     */
    name;
    /**
     * Types of the pokemon; Max 2 types the rest will be ignored
     * @type {Array.<"Normal" | "Fire" | "Fighting" | "Water" | "Flying" | "Grass" | "Poison" | "Electric" | "Ground" | "Psychic" | "Rock" | "Ice" | "Bug" | "Dragon" | "Ghost" | "Dark" | "Steel" | "Fairy">}
     */
    types;
    /**
     * Pokemon stats
     * @type {{hp: number, atk: number, def: number, spa: number, spd: number, spe: number}}
     */
    baseStats;
    /**
     * @type {Pokemon}
     */
    constructor(pokemonObj)
    {
        this.name = pokemonObj.name;
        this.types = pokemonObj.types;
        this.baseStats = pokemonObj.baseStats;
        /**
         * Id of the pokemon to get it in the dex
         * @type {string}
         */
        this.id = null;
        /**
         * @type {Array.<Move>}
         */
        this.moveSet = []
        /**
         * @type {Move}
         */
        this.selectedMove = null;
        /**
         * Stores pokemon health
         * @type {string}
         */
        this.health = Math.floor(Math.floor(((((2*pokemonObj.baseStats.hp)+100)*100)/100)+10));
    }
    /**
     * Take damage from a move
     * @param {Pokemon} source 
     * @param {Move} move 
     */
    takeDamage(source, move)
    {
        /// [Calculate Damage]
        // damage = ((2A/5+2)*B*C)/D)/50)+2)*X)*Y/10)*Z)/255
        // A = attacker's Level (always 100 here)
        // B = attacker's Attack or Special
        // C = attack Power
        // D = defender's Defense or Special
        // X = same-Type attack bonus (1 or 1.5)
        // Y = Type modifiers (40, 20, 10, 5, 2.5, or 0)
        // Z = a random number between 217 and 255

        // Get needed stats
        const attack    = move.category == "Physical" ? source.baseStats.atk : source.baseStats.spa;
        const defence   = move.category == "Physical" ? this.baseStats.def : this.baseStats.spd;
        const power     = move.getBasePower(source, this);
        const stab      = move.type == source.types[0] || move.type == source.types[1] ? 1.5 : 1; // Stab of source/move; so if (source.electric && move.electric) stab = 1.5f; or 1
        const effective = 1; // Effectiveness = 0 or .5 or 1 or 2 or 4
        const random    = Math.random() * (255 - 217) + 217; /// 217 = min; 255 = max;
        const level     = 100;

        const damage = ((((2 * level / 5 + 2) * attack * power / defence) / 50) + 2) * stab * effective;
        this.health -= damage;
        return damage;
    }
    /**
     * Take damage without move or source; Handy for recoil or abilities
     * @param {number} damage 
     */
    takeMiscDamage(damage)
    {
        this.health -= damage;
    }
}