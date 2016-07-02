import Preloader from "./Preloader";
import preloaderGif from "../../assets/preloader.gif";

export default class Boot {

	preload() {
		this.game.load.image("preloader", preloaderGif);
	}

	create() {
		this.game.state.start(Preloader.name);
	}

}
