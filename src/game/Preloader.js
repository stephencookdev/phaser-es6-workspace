import Game from "./Game";
import spritePng from "../../pre_build/spritesheet-1.png";
import spriteJson from "../../pre_build/spritesheet-1.json";

export default class Preloader {

	preload() {
		const preloader = this.add.sprite(0, 0, "preloader");
		this.load.setPreloadSprite(preloader);

		this.loadText = this.add.text(this.game.width / 2,
			this.game.height / 2,
			"Loading 0%",
			{ fill: "#000000" }
		);
		this.loadText.anchor.set(0.5, 0.5);

		this.load.onFileComplete.addOnce(this.onLoadUpdate, this);
		this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
		this.loadResources();
	}

	loadResources() {
		this.game.load.atlasJSONHash("mainAtlas",
			spritePng,
			null,
			spriteJson
		);
	}

	onLoadUpdate(progress) {
		this.loadText.setText(`Loading ${progress}%`);
	}

	onLoadComplete() {
		this.game.state.start(Game.name);
	}

}
