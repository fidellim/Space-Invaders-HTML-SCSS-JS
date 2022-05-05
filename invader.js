import InvaderProjectile from "./invaderProjectile.js";

export default class Invader {
	constructor(c, { position }) {
		this.c = c;
		this.velocity = {
			x: 0,
			y: 0,
		};

		const image = new Image();
		image.src = "./images/invader.png";
		image.onload = () => {
			const scale = 1;
			this.image = image;
			this.width = image.width * scale;
			this.height = image.height * scale;
			this.position = {
				x: position.x,
				y: position.y,
			};
		};
	}

	draw() {
		// c.fillStyle = 'red'
		// c.fillRect(this.position.x, this.position.y, this.width, this.height)

		this.c.drawImage(
			this.image,
			this.position.x,
			this.position.y,
			this.width,
			this.height
		);
	}

	update({ velocity }) {
		if (this.image) {
			this.draw();
			this.position.x += velocity.x;
			this.position.y += velocity.y;
		}
	}

	shoot(invaderProjectiles) {
		invaderProjectiles.push(
			new InvaderProjectile(this.c, {
				position: {
					x: this.position.x + this.width / 2,
					y: this.position.y + this.height,
				},
				velocity: {
					x: 0,
					y: 5,
				},
			})
		);
	}
}
