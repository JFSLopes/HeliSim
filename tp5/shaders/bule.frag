#ifdef GL_ES
precision highp float;
#endif

varying vec4 vPosition;

void main() {
    if (vPosition.y > 0.5) {
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);  // Amarelo
    } else {
        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);  // Azul
    }
}