export default class Projectile {
	constructor(c, { position, velocity, color = "red" }) {
		this.position = position;
		this.velocity = velocity;

		this.radius = 4;
		this.color = color;
		this.c = c;
	}

	draw() {
		this.c.beginPath();
		this.c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		this.c.fillStyle = this.color;
		this.c.fill();
		this.c.closePath();
	}

	update() {
		this.draw();
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}
