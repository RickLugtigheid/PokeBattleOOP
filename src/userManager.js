const Battle = require('./battle');
const { Socket, Server } = require('socket.io');
/**
 * @static
 */
module.exports = class
{
    /**
     * 
     * @param {Server} io 
     */
    static addListners(io)
    {
        io.on('connection', client =>
        {
            this.clients.push(client);
            client.on('battle', args =>
            {
                if(args['event'] == 'enter') this.userEnterBattleQueue(client);
            });
        });
    }
    /**
     * @type {Array.<Socket>}
     */
    static clients = [];
    /**
     * @type {Array.<Socket>}
     */
    static battleQueue = [];
    /**
     * @type {Array.<Battle>}
     */
    static activeBattles = [];
    /**
     * 
     * @param {Socket} user 
     */
    static userEnterBattleQueue(user)
    {
        // Show that user entered
        console.log(`[${user.id}]: Entered the battle queue`);
        // Add user to the queue
        this.battleQueue.push(user);
        if(this.battleQueue.length <= 1) return; // Don't start a battle
        do
        {
            // Get 2 players from the queue
            const player1 = this.battleQueue.shift();
            const player2 = this.battleQueue.shift();

            // Start a battle between these players
            this.startBattle(player1, player2);
        }
        while(this.battleQueue.length >= 1) // Until there is only one or 0 users in the queue
    }
    /**
     * Starts a battle between 2 users
     * @param {Socket} player1 
     * @param {Socket} player2 
     */
    static startBattle(player1, player2)
    {
        const battle = new Battle(player1, player2);
        this.activeBattles.push(battle);
    }
}