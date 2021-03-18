const {Move} = require('./moves');
const typeChart = require('./typechart');
/**
 * @type {Object.<string, Pokemon>}
 */
module.exports.dex =
{
    bulbasaur: {
        name: "Bulbasaur",
        types: ['Grass', 'Poison'],
        baseStats: {hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45}
    },
    ivysaur: {
        name: "Ivysaur",
        types: ['Grass', 'Poison'],
        baseStats: {hp: 60, atk: 62, def: 63, spa: 80, spd: 80, spe: 60}
    },
    venusaur: {
        name: "Venusaur",
        types: ['Grass', 'Poison'],
        baseStats: {hp: 80, atk: 82, def: 83, spa: 100, spd: 100, spe: 80}
    },
    charmander: {
        name: "Charmander",
        types: ['Fire'],
        baseStats: {hp: 39, atk: 52, def: 43, spa: 60, spd: 50, spe: 65}
    },
    charmeleon: {
        name: "Charmeleon",
        types: ["Fire"],
        baseStats: {hp: 58, atk: 64, def: 58, spa: 80, spd: 65, spe: 80}
    },
    charizard: {
        name: "Charizard",
        types: ['Fire', 'Flying'],
        baseStats: {hp: 78, atk: 84, def: 78, spa: 109, spd: 85, spe: 100}
    },
    squirtle: {
        name: "Squirtle",
        types: ['Water'],
        baseStats: {hp: 44, atk: 48, def: 65, spa: 50, spd: 64, spe: 43}
    },
    wartortle: {
        name: "Wartortle",
        types: ['Water'],
        baseStats: {hp: 59, atk: 63, def: 80, spa: 65, spd: 80, spe: 58}
    },
    blastoise: {
        name: "Blastoise",
        types: ['Water'],
        baseStats: {hp: 79, atk: 83, def: 100, spa: 85, spd: 105, spe: 78}
    },
    pikachu: {
        name: "Pikachu",
        types: ["Electric"],
        baseStats: {hp: 35, atk: 55, def: 40, spa: 50, spd: 50, spe: 90}
    },
}

class Pokemon
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
        const effective = this.calcEffectiveness(move); // Effectiveness = 0 or .5 or 1 or 2 or 4
        const level     = 100;

        const damage = ((((2 * level / 5 + 2) * attack * power / defence) / 50) + 2) * stab * effective;
        this.health -= damage;
        return {damage: damage, effectiveness: effective};
    }
    /**
     * Take damage without move or source; Handy for recoil or abilities
     * @param {number} damage 
     */
    takeMiscDamage(damage)
    {
        this.health -= damage;
    }
    /**
     * 
     * @param {Move} move 
     * @returns {Number} Effectiveness
     */
    calcEffectiveness(move)
    {
        let effectiveness = 1;
        if(this.types.length > 1) // So 2 types
        {
            // This wil take the type weaknessen/strengths of the move type for out types;
            // Outcomes:
            //      0 * 1 = 0   (no effect)
            //      0 * 2 = 0   (no effect)
            //      .5 * 1 = .5 (weak dammage)
            //      .5 * 2 = 1  (normal damage)
            //      1 * 1 = 1   (normal damage)
            //      2 * 1 = 2   (strong damage)
            //      2 * 2 = 4   (extreme damage)
            effectiveness = typeChart[this.types[0]][move.type] * typeChart[this.types[1]][move.type];
        }
        // Else just get the weakness/strength of out first type
        else typeChart[this.types[0]][move.type];
        return 1;
    }
}
module.exports.Pokemon = Pokemon;