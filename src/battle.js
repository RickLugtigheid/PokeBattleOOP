const { Socket } = require("socket.io");
const { dex, Pokemon } = require('../data/pokemons');
const { moves, Move } = require('../data/moves');
const learnsets = require('../data/learnsets');
const tiers = require('../data/tiers');

module.exports = class
{
    /**
     * @param {Socket} player1 
     * @param {Socket} player2 
     */
    constructor(player1, player2, tier)
    {
        // Set battle active
        this.active = true;

        // Get pokemon foreach player
        this.player1 = {socket: player1, pokemon: this.randomPokemon(tier)};
        this.player2 = {socket: player2, pokemon: this.randomPokemon(tier)};

        // Set battle events
        this.addListners(player1);
        this.addListners(player2);

        // Send start message to the clients
        this.player1.socket.emit('battle', {event: 'start', player: {id: this.player1.pokemon.id, name: this.player1.pokemon.name, stats: this.player1.pokemon.baseStats, moves: this.player1.pokemon.moveSet}, enemy: {id: this.player2.pokemon.id, name: this.player2.pokemon.name, stats: this.player2.pokemon.baseStats}});
        this.player2.socket.emit('battle', {event: 'start', player: {id: this.player2.pokemon.id, name: this.player2.pokemon.name, stats: this.player2.pokemon.baseStats, moves: this.player2.pokemon.moveSet}, enemy: {id: this.player1.pokemon.id, name: this.player1.pokemon.name, stats: this.player1.pokemon.baseStats}});
        
        console.log(`[Battle]: Started between '${this.player1.socket.id}' and '${this.player2.socket.id}'`);
    }
    /**
     * Add battle events to sockets
     * @param {Socket} player 
     */
    addListners(player)
    {
        // Get player
        const thisPlayer = player.id == this.player1.socket.id ? this.player1 : this.player2;

        // Set events
        player.on('move', args => 
        {
            if(!this.active) return;
            switch(args['event'])
            {
                case 'selected':
                    // Check if the move exists in the pokemons moveSet
                    if(!thisPlayer.pokemon.moveSet.includes(args['moveID'])) 
                    {
                        console.log(`[${player.id}]: ${thisPlayer.pokemon.name}'s Moveset doesn't include '${args['moveID']}'!`);
                        return; // Don't select args['moveID']
                    }
                    // Set selected move to move with id 'moveID'
                    thisPlayer.pokemon.selectedMove = new Move(moves[args['moveID']]);
                    // Try start if both players have selected a move
                    this.tryStartBattle();
                break;
                case 'deselected':
                    console.log(`[${player.id}]: Deselected move`);
                    // Set selected move to null
                    thisPlayer.pokemon.selectedMove = null;
                    // Try start if both players have selected a move
                    this.tryStartBattle();
                break;
                case 'info':
                    // Sends the moves info to the client
                    player.emit('move', {event: 'info', info: moves[args['moveID']], id: args['moveID']});
                break;
            }
        });
        player.on("disconnect", () => {
            if(!this.active) return;

            const enemy = (player.id == this.player1.socket.id ? this.player2.socket : this.player1.socket);
            enemy.emit('message', 'Enemy left...');
            this.end();
        });
    }
    /**
     * Tries to start the battle
     */
    async tryStartBattle()
    {
        // Check if our players are ready
        if(this.player1.pokemon.selectedMove == null || this.player2.pokemon.selectedMove == null) return;

        console.log('[Battle]: Starting turn');

        // Get the player that will move first and the one that moves last
        let first = (this.player1.pokemon.baseStats.spe >= this.player2.pokemon.baseStats.spe) ? this.player1 : this.player2;
        
        // Check if one of the moves has priority
        if(this.player1.pokemon.selectedMove.priority > this.player2.pokemon.selectedMove.priority || this.player1.pokemon.selectedMove.priority < this.player2.pokemon.selectedMove.priority)
            first = this.player1.pokemon.selectedMove.priority > this.player2.pokemon.selectedMove.priority ? this.player1 : this.player2;
        
        // Get the player that doesn't move first
        const last = first == this.player1 ? this.player2 : this.player1;

        // Use the selected moves
        this.useMove(first.pokemon, last.pokemon, first.pokemon.selectedMove);
        // Wait 1 second for the client animation
        setTimeout(() => 
        {
            this.useMove(last.pokemon, first.pokemon, last.pokemon.selectedMove)
            
            // Reset moves
            this.player1.pokemon.selectedMove = null;
            this.player2.pokemon.selectedMove = null;
        }, 1000)
    }
    /**
     * Use a move
     * @param {Pokemon} source 
     * @param {Pokemon} target 
     * @param {Move} move 
     */
    useMove(source, target, move)
    {
        if(!this.active) return;

        // Tell client that 'source' is attacking
        this.player1.socket.emit('pokemon', {event: 'attack', user: source == this.player1.pokemon});
        this.player2.socket.emit('pokemon', {event: 'attack', user: source == this.player2.pokemon});

        // Check accuracy
        if (move.doesHit())
        {
            // TODO: Implement Status moves
            switch(move.target)
            {
                case "normal":
                    // Let the target take damage
                    const dmg = target.takeDamage(source, move);

                    // Notify the clients that 'target' has take damage
                    this.player1.socket.emit('pokemon', {event: 'damage', user: target == this.player1.pokemon, damage: dmg.damage, effective: dmg.effectiveness});
                    this.player2.socket.emit('pokemon', {event: 'damage', user: target == this.player2.pokemon, damage: dmg.damage, effective: dmg.effectiveness});

                    // Check if move user should recive recoil
                    if(move.recoil) 
                    {
                        source.takeMiscDamage(dmg.damage * move.recoil);
                        this.player1.socket.emit('pokemon', {event: 'damage', user: source == this.player1.pokemon, damage: dmg.damage * move.recoil});
                        this.player2.socket.emit('pokemon', {event: 'damage', user: source == this.player2.pokemon, damage: dmg.damage * move.recoil});    
                    }

                    // Check if 'target' has health left
                    if(target.health <= 0)
                    {
                        // Target fainted so source won the battle
                        this.player1.socket.emit('pokemon', {event: 'faint', user: target == this.player1.pokemon});
                        this.player2.socket.emit('pokemon', {event: 'faint', user: target == this.player2.pokemon});
                        this.end();
                    }
                break;
                case "self":
                    // TODO: Implement Powerup moves targeted to self
                break;
            }
        }
        else 
        {
            // Notify to the clients that 'source' has taken damage
            this.player1.socket.emit('pokemon', {event: 'miss', user: source == this.player1.pokemon});
            this.player2.socket.emit('pokemon', {event: 'miss', user: source == this.player2.pokemon});
        }
    }
    /**
     * End this battle
     */
    end()
    {
        // Get our user manager
        const userManager = require('./userManager')

        console.log(`[Battle]: Ended between '${this.player1.socket.id}' and '${this.player2.socket.id}'`);
        this.player1.socket.emit('battle', {event: 'end'});
        this.player2.socket.emit('battle', {event: 'end'});
        
        // Remove this from active battles
        userManager.activeBattles = userManager.activeBattles.filter(battle =>
        {
            return battle != this;
        });
        
        // Remove players from clientsInBattle array
        userManager.clientsInBattle = userManager.clientsInBattle.filter(sock =>
        {
            return sock.id != this.player1.socket.id && sock.id != this.player2.socket.id;
        });

        // Unset players so we don't take events anymore and we can wait for the garbage collector without the players being bale to battle
        this.active = false;
        this.player1.socket = null;
        this.player2.socket = null;
    }
    /**
     * Gets a random pokemon to use for tthe battle
     * @return {Pokemon}
     */
    randomPokemon(tier)
    {
        // Get a random pokemon
        const pokemonid = tiers[tier].pokemons[Math.floor(Math.random() * tiers[tier].pokemons.length)];
        console.log(tiers);
        console.warn(tier);
        /**
         * @type {Pokemon}
         */
        let pokemon = new Pokemon(dex[pokemonid]);
        pokemon.id = pokemonid;

        // Get 4 random moves for this pokemon
        const learnset = learnsets[pokemonid];
        let moves = [];
        do
        {
            const move = learnset[Math.floor(Math.random() * learnset.length)]
            if(!moves.includes(move)) moves.push(move);
        }
        while(moves.length < 4);
        pokemon.moveSet = moves;

        return pokemon;
    }
}