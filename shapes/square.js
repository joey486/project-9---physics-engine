import { selectedShape } from "../main.js";
import { ctx, canvas, gravity, friction, groundFriction } from "../canvasSetup.js";
import { Shape } from "./shape.js";

let isDragging = false;

export class Square extends Shape {
    constructor(x, y, sideLength, color) {
        super(x, y, color);
        this.sideLength = sideLength;
        this.dx = Math.random() * 4 - 2; // Random horizontal speed
        this.dy = Math.random() * 4 - 2; // Random vertical speed
        this.mass = 1; // You can adjust the mass as needed
    }

    // Draw the square
    draw() {
        ctx.fillStyle = this.color; // Set the fill color
        ctx.fillRect(this.x, this.y, this.sideLength, this.sideLength); // Draw the square
    }

    update(squares) {
        if (!isDragging && this !== selectedShape) {
            // Existing gravity and physics logic
            if (this.y + this.sideLength + this.dy > canvas.height) {
                this.dy = -this.dy * friction; 
                this.y = canvas.height - this.sideLength;
    
                if (Math.abs(this.dy) < 1) {
                    this.dy = 0; 
                }
                if (Math.abs(this.dx) > 0.1) {
                    this.dx *= groundFriction;
                } else {
                    this.dx = 0;
                }
            } else {
                this.dy += gravity; 
            }
    
            if (this.x + this.sideLength + this.dx > canvas.width || this.x + this.dx < 0) {
                this.dx = -this.dx * friction;
            }
    
            this.x += this.dx;
            this.y += this.dy;
    
            for (let i = 0; i < squares.length; i++) {
                if (this !== squares[i] && this.isColliding(squares[i])) {
                    this.resolveCollision(squares[i]);
                }
            }
        }
        
        this.draw();
    }

    // Check if the square is under the cursor
    isUnderCursor(mouseX, mouseY) {
        return (
            mouseX >= this.x &&
            mouseX <= this.x + this.sideLength &&
            mouseY >= this.y &&
            mouseY <= this.y + this.sideLength
        );
    }

    // Check if the square is colliding with another square
    isColliding(otherSquare) {
        return !(
            this.x + this.sideLength < otherSquare.x || // No overlap on the right side
            this.x > otherSquare.x + otherSquare.sideLength || // No overlap on the left side
            this.y + this.sideLength < otherSquare.y || // No overlap on the bottom side
            this.y > otherSquare.y + otherSquare.sideLength // No overlap on the top side
        );
    }

    // Resolve collision between this square and another square
    resolveCollision(otherSquare) {
        // Get the distance between the two squares' centers
        const distX = this.x - otherSquare.x;
        const distY = this.y - otherSquare.y;

        // Calculate the overlap
        const overlapX = this.sideLength / 2 + otherSquare.sideLength / 2 - Math.abs(distX);
        const overlapY = this.sideLength / 2 + otherSquare.sideLength / 2 - Math.abs(distY);

        if (overlapX > 0 && overlapY > 0) {
            // Resolve collision by adjusting positions and velocities based on overlap
            if (overlapX < overlapY) {
                // Horizontal collision
                const direction = distX > 0 ? 1 : -1;
                this.x += direction * overlapX / 2;
                otherSquare.x -= direction * overlapX / 2;

                // Swap horizontal velocities
                const tempDx = this.dx;
                this.dx = otherSquare.dx;
                otherSquare.dx = tempDx;
            } else {
                // Vertical collision
                const direction = distY > 0 ? 1 : -1;
                this.y += direction * overlapY / 2;
                otherSquare.y -= direction * overlapY / 2;

                // Swap vertical velocities
                const tempDy = this.dy;
                this.dy = otherSquare.dy;
                otherSquare.dy = tempDy;
            }
        }
    }
}
