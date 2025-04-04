function controls(entities, { touches, dispatch }) {
    touches.forEach(t => {
        if (t.type === 'press') {
            dispatch({ type: 'jump' });
        }
    });
    return entities;
}

export default controls;
