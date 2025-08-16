precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main(void) {
    vec4 texColor = texture2D(uSampler, vTextureCoord);

    // Enhance yellow: mix red and green
    vec3 yellowTint = vec3(1.2, 1.0, 0.6); 
    vec3 enhancedColor = texColor.rgb * yellowTint + vec3(0.1, 0.05, 0.0); 

    enhancedColor = min(enhancedColor, vec3(1.0));
    gl_FragColor = vec4(enhancedColor, texColor.a);
}