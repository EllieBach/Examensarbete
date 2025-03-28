import Matter from 'matter-js';

function controls(entities, { touches, dispatch }) {
    const character = entities.character;

    if (character?.body) {
        touches.forEach(t => {
            if (t.type === 'press') {
                dispatch({ type: 'jump' });
                console.log('Jump dispatched');
            }
        });
    }
    
    return entities;
}

export default controls;
