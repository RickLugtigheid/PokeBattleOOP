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