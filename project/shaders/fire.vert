attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float timeFactor;

varying vec2 vTextureCoord;

void main() {
    vec3 pos = aVertexPosition;

    // Move top vertex (y == 1.0) to simulate flickering
    if (abs(pos.y - 1.0) < 0.01) {
        float wiggle = sin(timeFactor);
        pos.x += wiggle;
        pos.y += abs(sin(timeFactor * 3.0)) * 0.05;
    }

    vTextureCoord = aTextureCoord;
    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
}