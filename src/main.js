import "pixi.js";
import "p2";
import "phaser";

import "babel-polyfill";

import "../style/main.scss";
import Boot from "./game/Boot";
import Preloader from "./game/Preloader";
import Game from "./game/Game";

const game = new Phaser.Game(568, 320, Phaser.AUTO, "My-Game");

game.state.add(Boot.name, Boot);
game.state.add(Preloader.name, Preloader);
game.state.add(Game.name, Game);

game.state.start(Boot.name);
