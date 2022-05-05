import Player from "./player";
import Projectile from "./projectile";
import Grid from "./grid";
import Particle from "./particle";
import "./styles/index.scss";

const scoreEl = document.querySelector("#scoreEl");
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight - 50 - 4.1;
// canvas.width = 1024;
// canvas.height = 576;

const player = new Player(c, canvas);
const projectiles = [];
const grids = [];
const invaderProjectiles = [];
const particles = [];
const bombs = [];
const powerUps = [];

let frames = 0;
let randomInterval = Math.floor(Math.random() * 500 + 500);
let game = {
	over: false,
	active: true,
};
let score = 0;

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

function createScoreLabel({ score = 100, object }) {
	const scoreLabel = document.createElement("label");
	scoreLabel.innerHTML = score;
	scoreLabel.style.position = "absolute";
	scoreLabel.style.color = "white";
	scoreLabel.style.top = object.position.y + "px";
	scoreLabel.style.left = object.position.x + "px";
	scoreLabel.style.userSelect = "none";
	document.querySelector("#parentDiv").appendChild(scoreLabel);

	gsap.to(scoreLabel, {
		opacity: 0,
		y: -30,
		duration: 0.75,
		onComplete: () => {
			document.querySelector("#parentDiv").removeChild(scoreLabel);
		},
	});
}

function rectangularCollision({ rectangle1, rectangle2 }) {
	return (
		rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
		rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
		rectangle1.position.x <= rectangle2.position.x + rectangle2.width
	);
}

function endGame() {
	console.log("you lose");
	console.log(`Your score is ${score}`);

	setTimeout(() => {
		player.opacity = 0;
		game.over = true;
	}, 0);

	setTimeout(() => {
		game.active = false;
	}, 1000);

	createParticles({
		object: player,
		color: "white",
		fades: true,
	});

	// reset game
	// setTimeout(() => {
	// 	game.active = true;
	// 	player.opacity = 1;
	// 	game.over = false;
	// 	score = 0;
	// 	scoreEl.innerHTML = score;
	// 	grids.splice(0, grids.length);
	// 	projectiles.splice(0, projectiles.length);
	// 	invaderProjectiles.splice(0, invaderProjectiles.length);
	// 	animate();
	// }, 4000);
}

for (let i = 0; i < 100; i++) {
	particles.push(
		new Particle(c, {
			position: {
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
			},
			velocity: {
				x: 0,
				y: 0.3,
			},
			radius: Math.random() * 2,
			color: "white",
		})
	);
}

function createParticles({ object, color, fades }) {
	for (let i = 0; i < 15; i++) {
		particles.push(
			new Particle(c, {
				position: {
					x: object.position.x + object.width / 2,
					y: object.position.y + object.height / 2,
				},
				velocity: {
					x: (Math.random() - 0.5) * 2,
					y: (Math.random() - 0.5) * 2,
				},
				radius: Math.random() * 3,
				color: color || "#BAA0DE",
				fades,
			})
		);
	}
}

let spawnBuffer = 500;
const animate = () => {
	if (!game.active) return;

	requestAnimationFrame(animate);
	c.fillStyle = "black";
	c.fillRect(0, 0, canvas.width, canvas.height);
	player.update();

	// STARS BACKGROUND
	particles.forEach((particle, i) => {
		if (particle.position.y - particle.radius >= canvas.height) {
			particle.position.x = Math.random() * canvas.width;
			particle.position.y = -particle.radius;
		}

		if (particle.opacity <= 0) {
			setTimeout(() => {
				particles.splice(i, 1);
			}, 0);
		} else {
			particle.update();
		}
	});

	invaderProjectiles.forEach((invaderProjectile, index) => {
		if (
			invaderProjectile.position.y + invaderProjectile.height >=
			canvas.height
		) {
			setTimeout(() => {
				invaderProjectiles.splice(index, 1);
			}, 0);
		} else invaderProjectile.update();

		// projectile hits player
		if (
			rectangularCollision({
				rectangle1: invaderProjectile,
				rectangle2: player,
			})
		) {
			invaderProjectiles.splice(index, 1);
			endGame();
		}
	});

	projectiles.forEach((projectile, index) => {
		if (projectile.position.y + projectile.radius <= 0) {
			setTimeout(() => {
				projectiles.splice(index, 1);
			}, 0);
		}
		projectile.update();
	});

	grids.forEach((grid, gridIndex) => {
		grid.update();

		// spawn projectiles
		if (frames % 100 === 0 && grid.invaders.length > 0) {
			grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
				invaderProjectiles
			);
		}

		for (let i = grid.invaders.length - 1; i >= 0; i--) {
			const invader = grid.invaders[i];
			invader.update({ velocity: grid.velocity });

			for (let j = bombs.length - 1; j >= 0; j--) {
				const bomb = bombs[j];

				const invaderRadius = 15;

				// if bomb touches invader, remove invader
				if (
					Math.hypot(
						invader.position.x - bomb.position.x,
						invader.position.y - bomb.position.y
					) <
						invaderRadius + bomb.radius &&
					bomb.active
				) {
					score += 50;
					scoreEl.innerHTML = score;

					grid.invaders.splice(i, 1);
					createScoreLabel({
						object: invader,
						score: 50,
					});

					createParticles({
						object: invader,
						fades: true,
					});
				}
			}

			// projectiles hit enemy
			projectiles.forEach((projectile, j) => {
				if (
					projectile.position.y - projectile.radius <=
						invader.position.y + invader.height &&
					projectile.position.x + projectile.radius >= invader.position.x &&
					projectile.position.x - projectile.radius <=
						invader.position.x + invader.width &&
					projectile.position.y + projectile.radius >= invader.position.y
				) {
					setTimeout(() => {
						const invaderFound = grid.invaders.find(
							(invader2) => invader2 === invader
						);
						const projectileFound = projectiles.find(
							(projectile2) => projectile2 === projectile
						);

						// remove invader and projectile
						if (invaderFound && projectileFound) {
							score += 100;
							console.log(score);
							scoreEl.innerHTML = score;

							// dynamic score labels
							createScoreLabel({
								object: invader,
							});

							createParticles({
								object: invader,
								fades: true,
							});

							grid.invaders.splice(i, 1);
							projectiles.splice(j, 1);

							if (grid.invaders.length > 0) {
								const firstInvader = grid.invaders[0];
								const lastInvader = grid.invaders[grid.invaders.length - 1];

								grid.width =
									lastInvader.position.x -
									firstInvader.position.x +
									lastInvader.width;
								grid.position.x = firstInvader.position.x;
							} else {
								grids.splice(gridIndex, 1);
							}
						}
					}, 0);
				}
			});

			// remove player if invaders touch it
			if (
				rectangularCollision({
					rectangle1: invader,
					rectangle2: player,
				}) &&
				!game.over
			)
				endGame();
		} // end looping over grid.invaders
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

	// spawning enemies
	if (frames % randomInterval === 0) {
		console.log(spawnBuffer);
		console.log(randomInterval);
		spawnBuffer = spawnBuffer < 0 ? 100 : spawnBuffer;
		grids.push(new Grid(c, canvas, invaderProjectiles));
		randomInterval = Math.floor(Math.random() * 500 + spawnBuffer);
		frames = 0;
		spawnBuffer -= 100;
	}

	if (keys.space.pressed && player.powerUp === "MachineGun" && frames % 2 === 0)
		projectiles.push(
			new Projectile({
				position: {
					x: player.position.x + player.width / 2,
					y: player.position.y,
				},
				velocity: {
					x: 0,
					y: -10,
				},
				color: "yellow",
			})
		);

	frames++;
};
animate();

addEventListener("keydown", ({ key }) => {
	if (game.over) return;

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
			keys.space.pressed = true;

			if (player.powerUp === "MachineGun") return;

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
			keys.space.pressed = false;
			break;
	}
});
