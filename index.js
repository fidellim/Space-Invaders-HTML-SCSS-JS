import Player from "./player.js ";
import Projectile from "./projectile.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight - 4.1;

const player = new Player(c, canvas);
const projectiles = [];
const keys = {
	leftKey: {
		pressed: false,
	},
	rightKey: {
		pressed: false,
	},
	space: {
		pressed: false,
	},
};

const animate = () => {
	requestAnimationFrame(animate);
	c.fillStyle = "black";
	c.fillRect(0, 0, canvas.width, canvas.height);
	player.update();
	projectiles.forEach((projectile, index) => {
		if (projectile.position.y + projectile.radius <= 0) {
			setTimeout(() => {
				projectiles.splice(index, 1);
			}, 0);
		}
		projectile.update();
	});

	if (keys.leftKey.pressed && player.position.x >= 0) {
		player.velocity.x = -5;
		player.rotation = -0.15;
	} else if (
		keys.rightKey.pressed &&
		player.position.x + player.width <= canvas.width
	) {
		player.velocity.x = 5;
		player.rotation = 0.15;
	} else {
		player.velocity.x = 0;
		player.rotation = 0;
	}
};
animate();

addEventListener("keydown", ({ key }) => {
	switch (key) {
		case "a":
		case "ArrowLeft":
			keys.leftKey.pressed = true;
			break;
		case "d":
		case "ArrowRight":
			keys.rightKey.pressed = true;
			break;
		case " ":
			projectiles.push(
				new Projectile(c, {
					position: {
						x: player.position.x + player.width / 2,
						y: player.position.y,
					},
					velocity: {
						x: 0,
						y: -10,
					},
				})
			);
			break;
	}
});

addEventListener("keyup", ({ key }) => {
	switch (key) {
		case "a":
		case "ArrowLeft":
			keys.leftKey.pressed = false;
			break;
		case "d":
		case "ArrowRight":
			keys.rightKey.pressed = false;
			break;
		case " ":
			console.log(" ");
			break;
	}
});
