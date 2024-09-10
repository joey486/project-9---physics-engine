


export const canvas = document.getElementById('gameCanvas');
const clear = document.getElementById('clearScreenBtn');
export const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Physics Engine Parameters
const gravity = 0.5;
const friction = 0.9;
const groundFriction = 0.8; // Added ground friction to prevent balls from sliding infinitely

let selectedBall = null;
let isDragging = false;
let prevMouseX = 0;
let prevMouseY = 0;

export class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = Math.random() * 4 - 2; // Random horizontal speed
        this.dy = Math.random() * 4 - 2; // Random vertical speed
        this.mass = radius; // Assume mass is proportional to radius
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update(balls) {
        if (!isDragging || this !== selectedBall) {
            // Apply gravity and bounce off the floor
            if (this.y + this.radius + this.dy > canvas.height) {
                this.dy = -this.dy * friction; // Bounce with friction
                this.y = canvas.height - this.radius; // Reposition to stay on the floor

                // Apply ground friction if ball is on the floor and moving horizontally
                if (Math.abs(this.dy) < 1) {
                    this.dy = 0; // Stop vertical movement if it's very slow
                }
                if (Math.abs(this.dx) > 0.1) {
                    this.dx *= groundFriction; // Apply horizontal ground friction
                } else {
                    this.dx = 0; // Stop horizontal movement if it's very slow
                }
            } else {
                this.dy += gravity; // Apply gravity
            }

            // Bounce off the walls
            if (this.x + this.radius + this.dx > canvas.width || this.x - this.radius + this.dx < 0) {
                this.dx = -this.dx * friction;
            }

            this.x += this.dx;
            this.y += this.dy;

            // Check collision with other balls
            for (let i = 0; i < balls.length; i++) {
                if (this !== balls[i]) {
                    if (this.isColliding(balls[i])) {
                        this.resolveCollision(balls[i]);
                    }
                }
            }
        }

        this.draw();
    }

    isColliding(otherBall) {
        const distX = this.x - otherBall.x;
        const distY = this.y - otherBall.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        return distance < this.radius + otherBall.radius;
    }

    resolveCollision(otherBall) {
        const distX = this.x - otherBall.x;
        const distY = this.y - otherBall.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        // Prevent overlap: move the balls apart based on the overlap distance
        const overlap = this.radius + otherBall.radius - distance;
        const separationX = (distX / distance) * overlap / 2;
        const separationY = (distY / distance) * overlap / 2;

        this.x += separationX;
        this.y += separationY;
        otherBall.x -= separationX;
        otherBall.y -= separationY;

        // Unit normal and tangent vectors
        const normalX = distX / distance;
        const normalY = distY / distance;

        const tangentX = -normalY;
        const tangentY = normalX;

        // Dot products for normal and tangential velocities
        const dotProductTangent1 = this.dx * tangentX + this.dy * tangentY;
        const dotProductTangent2 = otherBall.dx * tangentX + otherBall.dy * tangentY;

        const dotProductNormal1 = this.dx * normalX + this.dy * normalY;
        const dotProductNormal2 = otherBall.dx * normalX + otherBall.dy * normalY;

        // Conservation of momentum in 1D
        const massSum = this.mass + otherBall.mass;
        const massDiff = this.mass - otherBall.mass;

        const newNormalVel1 = (dotProductNormal1 * massDiff + 2 * otherBall.mass * dotProductNormal2) / massSum;
        const newNormalVel2 = (dotProductNormal2 * -massDiff + 2 * this.mass * dotProductNormal1) / massSum;

        // Update velocities
        this.dx = tangentX * dotProductTangent1 + normalX * newNormalVel1;
        this.dy = tangentY * dotProductTangent1 + normalY * newNormalVel1;

        otherBall.dx = tangentX * dotProductTangent2 + normalX * newNormalVel2;
        otherBall.dy = tangentY * dotProductTangent2 + normalY * newNormalVel2;
    }

    isUnderCursor(mouseX, mouseY) {
        const distX = this.x - mouseX;
        const distY = this.y - mouseY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        return distance < this.radius;
    }
}

export const balls = [];

function init() {
    balls.push(new Ball(200, 200, 30, 'red'));
    balls.push(new Ball(400, 100, 20, 'blue'));
    balls.push(new Ball(600, 300, 40, 'green'));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => ball.update(balls));
    requestAnimationFrame(animate);
}

// Clear screen function
clear.addEventListener('click', (event) => {
    balls.length = 0; // Empty the array
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
});

// Mouse event listeners
canvas.addEventListener('mousedown', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Check if any ball is under the cursor
    for (let ball of balls) {
        if (ball.isUnderCursor(mouseX, mouseY)) {
            selectedBall = ball;
            isDragging = true;
            prevMouseX = mouseX;
            prevMouseY = mouseY;
            break;
        }
    }
});

canvas.addEventListener('mousemove', (event) => {
    if (isDragging && selectedBall) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Calculate velocity based on mouse movement
        let deltaX = mouseX - prevMouseX;
        let deltaY = mouseY - prevMouseY;

        // Update ball position
        selectedBall.x = mouseX;
        selectedBall.y = mouseY;

        // Set velocity of the ball based on mouse movement
        selectedBall.dx = deltaX/2;
        selectedBall.dy = deltaY/2;

        // Store the current mouse position for the next movement
        prevMouseX = mouseX;
        prevMouseY = mouseY;
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
    selectedBall = null;
});


init();
animate();



//Cursor code:
const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");

window.addEventListener("mousemove", function (e){
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    //cursorOutline.style.left = `${posX}px`;
    //cursorOutline.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, {duration: 250, fill: "forwards"});
});
