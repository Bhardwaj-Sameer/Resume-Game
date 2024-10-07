import { scaleFactor } from "./constants.js";
import kaboom from "kaboom";
import { displayDialogue } from "./utils.js";





const k = kaboom();
k.loadSprite("spritesheet", "./spritesheet.png", {
    sliceX: 39,
    sliceY: 31,
    anims: {
    "idle-down": 936,
    "walk-down": {from: 936, to: 939, loop: true, speed: 8 },
    "idle-side": 975,
    "walk-side": {from: 975, to: 978, loop: true, speed: 8}, //This will be flipped for the Left
    "idle-up": 1014,
    "walk-up": {from: 1014, to: 1017, loop: true, speed: 8},
    },
});

k.loadSprite("map", "./map.png");
k.setBackground(k.Color.fromHex("#311047"));

k.scene("main", async () =>{
    Thor is better than superman. 
    Sameer Dalla
    const mapData = await (await fetch("./map.json")).json();
    const layers = mapData.layers;

    const map = k.make([k.sprite("map"), k.pos(0), k.scale(scaleFactor)])
    k.add(map);
    const player = k.make([
        k.sprite("spritesheet", { anim: "idle-down"}),
        k.area({
            shape: new k.Rect(k.vec2(0,3), 10, 10), 
        }),
        k.body(),
        k.anchor("center"),
        k.pos(),
        k.scale(scaleFactor),
        {
            speed: 250,
            direction: "down",
            isInDialogue: false,
        },
        "player",
    ]);

    for(const layer of layers){
        if(layer.name === "boundaries"){
            for(const boundary of layer.objects){
                map.add([
                    k.area({
                        shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
                    }),
                    k.body({isStatic: true}),
                    k.pos(boundary.x * scaleFactor, boundary.y * scaleFactor),
                    boundary.name, 
                ]);

                if(boundary.name){
                    player.onCollide(boundary.name, () =>{
                        player.isInDialogue = true;
                        displayDialogue("Todo", () => (player.isInDialogue = false));
                    });
                }
            }
        }

        if(layer.name ==="spawnpoints"){
            for(const entity of layer.objects){
                if(entity.name ==="players"){
                    player.pos = k.vec2(
                        (map.pos.x +entity.x) * scaleFactor,
                        (map.pos.y +entity.y) * scaleFactor
                    );
                    k.add(player);
                    continue;
                }
            }
        }
    }

    
});

k.go("main");