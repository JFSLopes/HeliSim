precision mediump float;

varying vec2 vTextureCoord;

uniform float uTime;
uniform vec3 uBaseColor;
uniform float uFrequency;

void main(void) {
    float pulse = 0.5 * (sin(6.2831 * uFrequency * uTime) + 1.0);

    vec3 color = pulse * uBaseColor;
    gl_FragColor = vec4(color, 1.0);
}