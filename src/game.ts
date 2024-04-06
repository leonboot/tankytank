import { Application } from 'pixi.js';
import { Tank } from './tank.class';

var gamepad: Gamepad;

window.addEventListener('gamepadconnected', (event: GamepadEvent) => {
    gamepad = event.gamepad
});
  
(async () => {

    const app = new Application();
    await app.init({ background: '#1099bb', resizeTo: window });
    document.body.appendChild(app.canvas);

    const tank = new Tank(app);
    tank.setPosition(app.canvas.width / 2, app.canvas.height / 2);
    let prevFireButtonState: boolean = false;
    app.ticker.add(() => {

        if (gamepad) {
            tank.updateHeading(gamepad.axes[0]);
            tank.setSpeed(gamepad.axes[1]);
            tank.rotateTurret(gamepad.axes[2]);
            if (gamepad.buttons[14].pressed != prevFireButtonState) {
                if (gamepad.buttons[14].pressed) {
                    tank.fire();
                }
            }
            prevFireButtonState = gamepad.buttons[14].pressed;
        }

    });

})();
