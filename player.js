export default class Player {
	constructor(c, canvas) {
		this.c = c;
		this.canvas = canvas;
		this.velocity = {
			x: 0,
			y: 0,
		};
		this.rotation = 0;

		const image = new Image();
		image.src = "./images/spaceship.png";
		image.onload = () => {
			const scale = 0.15;
			this.image = image;
			this.width = image.width * scale;
			this.height = image.height * scale;
			this.position = {
				x: this.canvas.width / 2 - this.width / 2,
				y: this.canvas.height - this.height - 20,
			};
		};
	}

	draw() {
		this.c.save();
		this.c.translate(
			this.position.x + this.width / 2,
			this.position.y + this.height / 2
		);
		this.c.rotate(this.rotation);
		this.c.translate(
			-this.position.x - this.width / 2,
			-this.position.y - this.height / 2
		);
		this.c.drawImage(
			this.image,
			this.position.x,
			this.position.y,
			this.width,
			this.height
		);
		this.c.restore();
	}

	update() {
		if (this.image) {
			this.draw();
			this.position.x += this.velocity.x;
		}
	}
}
