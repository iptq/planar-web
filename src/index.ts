import { Game } from "./game";
import { KeyDown, KeyUp } from "./events";

import { zip } from "./util";
for (let x of zip([1, 2, 3], [4, 5, 6])) {
    console.log("zipped:", x);
}

let canvas = <HTMLCanvasElement> document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let game = new Game();
window.addEventListener("keydown", event => game.events.push(<KeyDown> { kind: "keydown", code: event.keyCode }), false);
window.addEventListener("keyup", event => game.events.push(<KeyUp> { kind: "keyup", code: event.keyCode }), false);

let loop = () => {
    game.loop(ctx);
    requestAnimationFrame(loop);
};

loop();
