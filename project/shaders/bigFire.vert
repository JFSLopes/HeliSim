attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float timeFactor;

varying vec2 vTextureCoord;

void main(void) {
    vec3 pos = aVertexPosition;

    // Flicker the top vertex (y == 1.0)
    if( pos.y  >= 1.0) {
        float wiggle = sin(timeFactor * 3.0 + pos.x * 10.0) * 0.5;
        pos.x += wiggle;
        pos.y += abs(sin(timeFactor)) * 3.0;
    }

    vTextureCoord = aTextureCoord;
    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
}
