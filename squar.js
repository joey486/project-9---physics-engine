import { canvas } from "./main.js";
import { ctx } from "./canvasSetup.js";

// Physics Engine Parameters
const gravity = 0.5;
const friction = 0.9;
const groundFriction = 0.8; // Added ground friction to prevent balls from sliding infinitely