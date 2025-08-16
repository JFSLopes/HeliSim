precision mediump float;

uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float mixFactor;

varying vec2 vTextureCoord;

void main() {
    vec4 texColor1 = texture2D(uTexture1, vTextureCoord);
    vec4 texColor2 = texture2D(uTexture2, vTextureCoord);
    gl_FragColor = mix(texColor1, texColor2, mixFactor);
}