// Get dom elements
const ENEMY_CONTAINER = document.getElementById('enemy');
const PLAYER_CONTAINER = document.getElementById('player');
const BATTLE_BTN = document.getElementById('battle-btn');
const MOVE_LIST = document.getElementById('move-list');
const BATTLE_LOGS = document.getElementById('battle-logs');

// Start our socket
const socket = io();

// Set button events
BATTLE_BTN.onclick = function()
{
    // Go to the battle queue and set battle btn in active
    socket.emit('battle', {event: 'enter'});
    console.log('Sending: ', {'battle': {event: 'enter'}});
    BATTLE_BTN.classList.add('disabled');
}

// Set event listners
socket.on('battle', args =>
{
    console.log('Recived: ', {'battle': args});
    switch(args['event'])
    {
        case "start":
            // Set pokemon of the user `args['player']` and enemy `args['enemy']`
            
            // Show all battle elements
            Containers.load('battle');

            // Set animations
            PLAYER_CONTAINER.querySelector('img').src = `../pokemon/${args['player'].id}_back.gif`; // Player back animation
            ENEMY_CONTAINER.querySelector('img').src = `../pokemon/${args['enemy'].id}_front.gif`; // Enemy front sprite

            // Set name and stats
            const playerHP = Math.floor(Math.floor(((((2*args['player'].stats.hp)+100)*100)/100)+10));
            PLAYER_CONTAINER.querySelector("#name").innerHTML = args['player'].name;
            PLAYER_CONTAINER.querySelector("progress").max = playerHP;
            PLAYER_CONTAINER.querySelector("progress").value = playerHP;

            const enemyHP = Math.floor(Math.floor(((((2*args['enemy'].stats.hp)+100)*100)/100)+10));
            ENEMY_CONTAINER.querySelector("#name").innerHTML = args['enemy'].name;
            ENEMY_CONTAINER.querySelector("progress").max = enemyHP;
            ENEMY_CONTAINER.querySelector("progress").value = enemyHP;

            // Add moves to move list
            args['player'].moves.forEach(move => {
                // Ask for move info
                socket.emit('move', {event: 'info', moveID: move})
            });
        break;
        case "end":
            //Containers.load('home');
        break;
    }
});
socket.on('pokemon', args =>
{
    console.log('Recived: ', {'pokemon': args});
    switch(args['event'])
    {
        case 'attack':
            // Play attack animation for pokemon
            playAttackAnimation(args['user']);
            write(`${getPokemon(args['user'])} used ${args['move']}`);
        break;
        case 'miss':
            // Attack has missed
            write(`${getPokemon(args['user'])} missed!`);
        break;
        case 'damage':
            // Update healthbar for pokemon
            // Check if it is our pokemon
            if(args['user']) PLAYER_CONTAINER.querySelector('progress').value -= args['damage'];
            else ENEMY_CONTAINER.querySelector('progress').value -= args['damage'];
        break;
        case 'faint':
            // We only have one pokemon per player so this is a win or loss
            //if(args['user']) alert('You won!!!');
            //else alert('You lost');
            write(`${getPokemon(args['user'])} fainted!`);
            playFaintAnimation(args['user']);
        break;
    }
});
socket.on('move', args =>
{
    console.log('Recived: ', {'move': args});
    switch(args['event'])
    {
        case 'info':
            // Create a element for the move
            const moveElement = document.createElement('li');
            moveElement.innerHTML = args['info'].name;
            moveElement.onclick = function()
            {
                console.log('Sending: ', {'move': {event: 'selected', moveID: args['id']}});
                socket.emit('move', {event: 'selected', moveID: args['id']});
            };
            moveElement.classList.value = args['info'].type + ' move btn btn-primary';
            MOVE_LIST.appendChild(moveElement);
        break;
    }
});
/**
 * Gets player or enemy pokemon
 * @param {boolean} ofPlayer 
 * @returns Name of the pokemon 
 */
function getPokemon(ofPlayer)
{
    return document.querySelector((ofPlayer ? '#player' : '#enemy') + ' #name').innerHTML;
}
/**
 * Writes a line to the battle log
 * @param {string} text 
 */
function write(text)
{
    
}
/**
 * Play's attack animation for a pokemon
 * @param {bool} isPlayer 
 */
function playAttackAnimation(isPlayer)
{
    const character = document.querySelector((isPlayer ? '#player' : '#enemy') + ' img');
    character.animate(
        { transform: [ 'translateX(0px)', `translateX(${!isPlayer ? '-' : ''}27px)`, 'translateX(0px)' ] },
        { duration: 150, iterations: 1 }
    );
}
/**
 * Plays faint animation for a pokemon
 * @param {boolean} isPlayer 
 */
function playFaintAnimation(isPlayer)
{
    const character = document.querySelector((isPlayer ? '#player' : '#enemy') + ' img');
    // When fainting play animation
    character.animate(
        { transform: [ 'translateY(0px)', 'translateY(160px)' ] },
        { duration: 300, iterations: 1 }
    ).addEventListener('finish', () =>  
    {
        // Than faint the caracter
        character.style.opacity = 0;
    });
}