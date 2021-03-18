/**
 * Battle tiers; Pokemon in these tiers have the same power level
 * @type {Object.<string, {pokemons: Array.<string>}>}
 */
module.exports = {
    lc: {
        pokemons: [
            'bulbasaur',
            'charmander',
            'squirtle'
        ]
    },
    uu: {
        pokemons: [
            'ivysaur',
            'charmeleon',
            'wartortle',
            'pikachu'
        ]
    },
    ou: {
        pokemons: [
            'venusaur',
            'charizard',
            'blastoise'
        ]
    }
}

/**
 * Triers:
 * LC => Little Cup; So weak(stage 1) pokemon
 * UU => Under Used; So avarage pokemon
 * OU => Over Used; So strong pokemon (and no op pokemon)
 */