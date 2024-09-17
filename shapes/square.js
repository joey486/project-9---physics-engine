import { selectedShape } from "../main.js";
import { ctx, canvas, gravity, friction, groundFriction } from "../canvasSetup.js";
import { Shape } from "./shape.js";

let isDragging = false;

export class Square extends Shape {
    constructor(x, y, length, color) {
        super(x, y, color);
        this.length = length;
        this.dx = Math.random() * 4 - 2; // Random horizontal speed
        this.dy = Math.random() * 4 - 2; // Random vertical speed
        this.rotation = 0; // Initial rotation angle
        this.rotationSpeed = Math.random() * 0.05; // Random rotation speed
    }

    draw() {
        // Save the current context before applying transformations
        ctx.save();
        
        // Translate the canvas to the square's center
        ctx.translate(this.x + this.length / 2, this.y + this.length / 2);
        
        // Rotate the canvas
        ctx.rotate(this.rotation);
        
        // Draw the square with the rotation applied
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.length / 2, -this.length / 2, this.length, this.length);
        
        // Restore the canvas to its original state
        ctx.restore();
    }

    update(squares) {
        if (!isDragging && this !== selectedShape) {
            // Gravity and physics logic
            if (this.y + this.length + this.dy > canvas.height) {
                this.dy = -this.dy * friction;
                this.y = canvas.height - this.length;
    
                // Determine which corner is hitting the floor
                const leftCorner = this.x;
                const rightCorner = this.x + this.length;
    
                // Check if the left corner is below the ground and rotation is to the left (counterclockwise)
                if (leftCorner <= 0 && this.rotationSpeed < 0) {
                    this.rotationSpeed = -this.rotationSpeed; // Reverse rotation to the right
                }
    
                // Check if the right corner is below the ground and rotation is to the right (clockwise)
                if (rightCorner >= canvas.width && this.rotationSpeed > 0) {
                    this.rotationSpeed = -this.rotationSpeed; // Reverse rotation to the left
                }
    
                // Apply ground friction to the rotation speed
                this.rotationSpeed *= groundFriction;
    
                // Stop rotating if speed is small enough
                if (Math.abs(this.rotationSpeed) < 0.01) {
                    this.rotationSpeed = 0;
                    this.rotation = 0; // Reset rotation to 0
                }
    
                // Stop vertical movement if it's negligible
                if (Math.abs(this.dy) < 1) {
                    this.dy = 0;
                }
    
                // Apply horizontal friction
                if (Math.abs(this.dx) > 0.1) {
                    this.dx *= groundFriction;
                } else {
                    this.dx = 0;
                }
            } else {
                // Apply gravity
                this.dy += gravity;
            }
    
            // Bounce off the sides
            if (this.x + this.length + this.dx > canvas.width || this.x + this.dx < 0) {
                this.dx = -this.dx * friction;
            }
    
            // Update position
            this.x += this.dx;
            this.y += this.dy;
    
            // Update rotation
            this.rotation += this.rotationSpeed;
    
            // Collision detection with other squares
            for (let i = 0; i < squares.length; i++) {
                if (this !== squares[i] && this.isColliding(squares[i])) {
                    this.resolveCollision(squares[i]);
                }
            }
        }
    
        // Draw the square with updated rotation
        this.draw();
    }
    
    setRotationSpeed(velocity) {
        this.rotationSpeed = velocity;
        return this;
    }

    setInPlace(){
        this.dx = 0;
        this.dy = 0;
        this.rotation = 0;
        this.rotationSpeed = 0;
        return this;
    }

    // Check if the square is under the cursor
    isUnderCursor(mouseX, mouseY) {
        return (
            mouseX >= this.x &&
            mouseX <= this.x + this.length &&
            mouseY >= this.y &&
            mouseY <= this.y + this.length
        );
    }

    // Check if the square is colliding with another square
    isColliding(otherSquare) {
        return !(
            this.x + this.length < otherSquare.x || // No overlap on the right side
            this.x > otherSquare.x + otherSquare.length || // No overlap on the left side
            this.y + this.length < otherSquare.y || // No overlap on the bottom side
            this.y > otherSquare.y + otherSquare.length // No overlap on the top side
        );
    }

    // Resolve collision between this square and another square
    resolveCollision(otherSquare) {
        // Get the distance between the two squares' centers
        const distX = this.x - otherSquare.x;
        const distY = this.y - otherSquare.y;

        // Calculate the overlap
        const overlapX = this.length / 2 + otherSquare.length / 2 - Math.abs(distX);
        const overlapY = this.length / 2 + otherSquare.length / 2 - Math.abs(distY);

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