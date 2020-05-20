const p3 = require('../packages/client');
const ws = require('@kalm/ws');

const fps = 60;
const keyboardManager = {
    80: false,
    81: false,
    82: false,
    83: false,
    mouse: false,
};
const mouseManager = { mouse_x: 0, mouse_y: 0 };

let controllerId;

const networkManager = p3.connect({
    host: '0.0.0.0',
    port: 3000,
    transport: ws(),
});

function draw() {
    setTimeout(draw, 1000 / fps);

    // Update inputs
    networkManager.setInputState(controllerId, keyboardManager); // Determines delta
    networkManager.updateEntity(controllerId, mouseManager); // Determines delta

    const entities = networkManager.getEntities({ frameOffset: -2 }); // We give ourselves 2 frames of input lag- 0 being realtime
    for (let i = 0; i < entities.length; i++) {
        // Render entities
    }
}

function handleInputChange(value, inputOverride) {
    return (evt) => {
        if ((inputOverride || evt.keyCode) in keyboardManager) {
            keyboardManager[(inputOverride || evt.keyCode)] = value;
        }
    };
}

function bindControls() {
    controllerId = networkManager.createEntity('player_contoller', { mouse_x: 0, mouse_y: 0 });

    window.addEventListener('keyup', handleInputChange(false));
    window.addEventListener('keydown', handleInputChange(true));
    window.addEventListener('mousedown', handleInputChange(true, 'mouse'));
    window.addEventListener('mouseup', handleInputChange(false, 'mouse'));
}

bindControls();
draw();