// Init
document.querySelector('#battle-end-msg button').onclick = function()
{
    // Go back home
    Containers.load('home');
    // Disable this
    document.getElementById('battle-end-msg').classList.add('disabled');
    // Reset battle container
    MOVE_LIST.innerHTML = '';
    PLAYER_CONTAINER.querySelector('img').style.opacity = 1;
    ENEMY_CONTAINER.querySelector('img').style.opacity = 1;
    document.getElementById('battle-container').style.opacity = 1;
};


class Containers
{
    /**
     * @type {'home' | 'battle'}
     */
    static container = 'home';

    /**
     * 
     * @param {'home' | 'battle'} container 
     */
    static load(container)
    {
        container == 'home' ? document.getElementById('home-container').classList.remove('disabled') : document.getElementById('home-container').classList.add('disabled');
        container == 'battle' ? document.getElementById('battle-container').classList.remove('disabled') : document.getElementById('battle-container').classList.add('disabled');
        Containers.container = container;
    }
}