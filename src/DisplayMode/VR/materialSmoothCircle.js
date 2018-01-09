/* global AFRAME */
// Grid along X and Z (horizontal planes).

AFRAME.registerShader('smooth-circle', {
    schema: {
        color: { type: 'color', is: 'uniform', default: 'white' },
        alpha: { type: 'float', is: 'uniform', default: 0.5 },
        blur: { type: 'float', is: 'uniform', default: 0.1 }
    },

    raw: true,

    vertexShader: [
        'precision mediump float;',
        'attribute vec2 uv;',
        'attribute vec3 position;',
        'uniform mat4 projectionMatrix;',
        'uniform mat4 modelViewMatrix;',
        'uniform float alpha;',
        'uniform float blur;',
        'varying vec2 vUv;',

        'void main() {',
        '   vUv = uv;',
        '   gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}'
    ].join('\n'),

    fragmentShader: [
        '#extension GL_OES_standard_derivatives: enable',
        'precision mediump float;',
        'uniform vec3 color;',
        'uniform float alpha;',
        'uniform float blur;',
        'varying vec2 vUv;',

        'void main() {',
        '   vec2 uv = vUv;',
        '   vec2 center = vec2(0.5, 0.5);',
        '   float opacity = alpha;',
        '   vec4 bkg_color = vec4(color, 0.0);',

        '   uv -= center;',
        '   float dist = sqrt(dot(uv, uv));',
        '   float radius = 0.5 - blur;',
        '   float borderSize = blur;',
        '   vec4 fColor = vec4(color, opacity);',
        '   float t = smoothstep(radius + borderSize, radius - borderSize, dist);',
        '   gl_FragColor = mix(bkg_color, fColor, t);',
        '}'
    ].join('\n')
});