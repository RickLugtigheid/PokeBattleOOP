/**
 * @type {Object.<string, Pokemon>}
 */
const dex = 
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

class Pokemon
{
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
        const power     = move.getBasePower();
        const stab      = move.type == source.types[0] || move.type == source.types[1] ? 1.5 : 1; // Stab of source/move; so if (source.electric && move.electric) stab = 1.5f; or 1
        const typeModifiers = null; // Check wat should be here
        const random    = Math.random() * (255 - 217) + 217; /// 217 = min; 255 = max;
    }
}