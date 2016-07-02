import gulp from "gulp";
import gutil from "gulp-util";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import webpack from "webpack";
import del from "del";
import gulpWebpack from "webpack-stream";
import packer from "gamefroot-texture-packer";
import connect from "gulp-connect";
import { cordova } from "cordova-lib";
import Q from "q";
import fs from "fs";
import webpackConfig from "./webpack.config.js";

const withinDir = (dir, promiseFunc) => {
	const prevDir = process.cwd();
	process.chdir(dir);

	return promiseFunc()
		.then(() => process.chdir(prevDir));
};

gulp.task("connect", () => connect.server({
		root: "build",
		livereload: true
	})
);

gulp.task("server-reload", () => connect.reload());

gulp.task("watch", () => {
	gulp.watch(
		["index.html"],
		["clean:html", "html", "server-reload"]
	);
	gulp.watch(
		["assets/**/*"],
		["clean:atlas", "build-atlas", "clean:webpack", "webpack", "server-reload"]
	);
	gulp.watch(
		["src/**/*", "style/**/*", "levels/**/*"],
		["clean:webpack", "webpack", "server-reload"]
	);
});

gulp.task("build-atlas", () => {
	const deferred = Q.defer();
	packer("assets/**/*.png",
		{
			format: "json",
			path: "pre_build",
			fullpath: true
		},
		(err) => {
			if (err) throw err;
			gutil.log("spritesheet successfully generated");
			deferred.resolve();
		}
	);

	return deferred;
});
gulp.task("clean:atlas", () => del("pre_build"));

gulp.task("init-ws", () => {
	if(!fs.existsSync("cordova-ws")) {
		return cordova.raw.create("cordova-ws")
			.then(withinDir(
				"cordova-ws",
				() => cordova.raw.platform("add", ["android"])
			));
	}
});

gulp.task("cordova-build", ["default"], () => Q()
	.then(withinDir(
		"cordova-ws",
		() => cordova.raw.build({
			platforms: ["android"],
			options: {
				release: true
			}
		})
	))
);

gulp.task("cordova-run", ["default"], () =>
	withinDir("cordova-ws", cordova.raw.run)
);

gulp.task("server", ["default", "connect", "watch"]);

gulp.task("html", () => gulp.src("index.html")
	.pipe(gulp.dest("build"))
	.pipe(gulp.dest("cordova-ws/www"))
);
gulp.task("clean:html", () => del(["build/index.html", "cordova-ws/www/index.html"]));

gulp.task("webpack", () => gulp.src("src/main.js")
	.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
	.pipe(gulpWebpack(webpackConfig, webpack))
	.pipe(gulp.dest("build"))
	.pipe(gulp.dest("cordova-ws/www"))
);
gulp.task("clean:webpack", () => del(["build/bundle.js"], ["cordova-ws/www/bundle.js"]));

gulp.task("default", ["html", "build-atlas", "webpack"]);
