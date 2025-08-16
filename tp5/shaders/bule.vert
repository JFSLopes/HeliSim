attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec4 vPosition;  // Variável para passar a posição ao fragment shader

uniform float timeFactor;
uniform float normScale;

varying vec2 vTextureCoord;

void main() {
    float offsetX = sin(normScale);

    // Aplica o deslocamento à posição do vértice
    vec4 vertex = vec4(aVertexPosition.x + offsetX, aVertexPosition.y, aVertexPosition.z, 1.0);
    
    // Aplica as transformações da câmera e projeção
    gl_Position = uPMatrix * uMVMatrix * vertex;

    // Passa a posição transformada para o fragment shader
    vPosition = gl_Position;

    vTextureCoord = aTextureCoord;
}