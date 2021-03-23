# Socket Server events

### Battle:
    - battle, {event: 'start', player: {id: '', name: '', hp: ''}, enemy: {id: '', name: '', hp: ''}}  // Tels client that battle has started and the pokemon of the client and enemy

### Pokemon:
    - pokemon, {event: 'attack', user: false | true}     // Tels client to play attack animation for pokemon
    - pokemon, {event: 'miss', user: false | true}
    - pokemon, {event: 'damage', user: false | true, damage: number}    // Tels client that pokemon has taken damage

# Socket Client events

### Battle:
    - battle, {event: 'enter'}

### Move:
    - move, {event: 'info', moveID: ''}     // Gets info on the move. like basepower pp and more
    - move, {event: 'selected', moveID: ''} // Lets the player select a move
    - move, {event: 'deselected'}           // Lets player deselect a move

### Pokemon:
    - pokemon, {event: 'get_moves', id: 'pokemonid'}    // Gets the moves of a pokemon