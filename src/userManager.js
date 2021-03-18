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
                console.log('[Battle]: Recived ', args);
                if(args['event'] == 'enter') 
                {
                    this.userEnterBattleQueue(client, args['tier']);
                    client.on('disconnect', () =>
                    {
                        this.battleQueue[args['tier']][client] = null;
                    });
                }
            });
        });
    }
    /**
     * @type {Array.<Socket>}
     */
    static clients = [];
    /**
     * @type {Object.<string, Array.<Socket>>}
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
    static userEnterBattleQueue(user, tier)
    {
        // Show that user entered
        console.log(`[${user.id}]: Entered the '${tier}' battle queue`);

        // If there is no array for this tier than create one
        if(!this.battleQueue[tier]) this.battleQueue[tier] = [];

        // Add user to the queue
        this.battleQueue[tier].push(user);

        if(this.battleQueue[tier].length <= 1) return; // Don't start a battle
        do
        {
            // Get 2 players from the queue
            const player1 = this.battleQueue[tier].shift();
            const player2 = this.battleQueue[tier].shift();

            if(player1 == null || player2 == null) continue;

            // Start a battle between these players
            this.startBattle(player1, player2, tier);
        }
        while(this.battleQueue[tier].length >= 1) // Until there is only one or 0 users in the queue
    }
    /**
     * Starts a battle between 2 users
     * @param {Socket} player1 
     * @param {Socket} player2 
     */
    static startBattle(player1, player2, tier)
    {
        const battle = new Battle(player1, player2, tier);
        this.activeBattles.push(battle);
    }
}