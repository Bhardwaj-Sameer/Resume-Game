import kaboom from "kaboom";

export const k = kaboom({
    global: false,
    touchtoMouse: true,
    canvas: document.getElementById("game"),
})