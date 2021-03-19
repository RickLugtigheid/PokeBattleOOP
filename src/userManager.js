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
            client.on('battle', args =>
            {
                console.log('[Battle]: Recived ', args);
                if(args['event'] == 'enter') 
                {
                    this.userEnterBattleQueue(client, args['tier']);
                }
            });
            this.clients.push(client);
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
        // Drop user from the queue when disconnected
        user.on('disconnect', () =>
        {
            console.log(`[${user.id}]: Left the '${tier}' battle queue...`);

            // Remove the user from the battle queue so we don't start a battle with the unconnected user
            this.battleQueue[tier] = this.battleQueue[tier].filter(function(sock){ 
                return sock != user; 
            });
        });
        // Let the user cancel this queue
        user.on('battle', args =>
        {
            // Remove the user from the battle queue so we don't start a battle with the unconnected user
            if(args['event'] == 'cancel' && this.battleQueue[args['tier']]) this.battleQueue[args['tier']] = this.battleQueue[args['tier']].filter(function(sock){ return sock != user; });
        });

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