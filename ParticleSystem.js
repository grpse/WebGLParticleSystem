function ParticleSystem(glContext) {

    var particlesVertShader = `
    attribute vec3 aVertexPosition_ModelSpace;
    attribute vec4 aColorForParticle;

    uniform mat4 WVP;

    varying vec4 particleColor;

    void main() {
        gl_Position = WVP * aVertexPosition_ModelSpace; 
        particleColor = aColorForParticle;
    }
    `;

    var particlesFragShader = `
    varying vec4 particleColor;
    
    void main() {
        gl_FragColor = particleColor;
    }
    `;

    var self = this;
    var gl = self.gl = glContext;
    self.shaderProgram = shaderProgram;


    ParticleSystem.kMaxParticles = 50;

    self.quad = new Float32Array([
        -1, -1,
         1, -1,
         1,  1,
        -1,  1,        
    ]);

    init();
    function init() {
        self.shaderProgram = 
        setupBillboard();
        setupPositionsBuffer();
        setupColorsBuffer();
    }

    self.instantiate = function(numberOfParticles) {

    };

    function update() {
        updatePositions();
        updateColors();
    }

    function updatePositions() {

    }

    function updateColors() {

    }


    function setupBillboard() {
        self.billboardBuffer = new Buffer(gl, WebGL.BufferType.ArrayBuffer);
        self.billboardBuffer.bind()
        self.billboardBuffer.setBufferData(self.quad);
        
        self.billboardFormat = new BufferFormat();
        self.billboardFormat.index = self.shaderProgram.getAttribLocation("aVertexPosition_ModelSpace");
        self.billboardFormat.size = 3;
        self.billboardFormat.type = WebGL.Type.Float;
        self.billboardFormat.normalized = false;
        self.billboardFormat.stride = 0;
        self.billboardFormat.pointer = 0;

        self.billboardBuffer.setVertexAttributeArrayFormat(self.billboardFormat);
    }

    function setupPositionsBuffer() {
        self.positionsBuffer = new Buffer(gl, WebGL.BufferType.ArrayBuffer);
        self.positionsBuffer.bind();
        self.positionsBuffer.setBufferData(0, gl.STREAM_DRAW, 0, ParticleSystem.kMaxParticles * 4 * sizeof(float));

        self.positionsFormat = new BufferFormat();
        self.positionsFormat.index = self.shaderProgram.getAttribLocation("aVertexPosition_ModelSpace");
        self.positionsFormat.size = 3;
        self.positionsFormat.type = WebGL.Type.Float;
        self.positionsFormat.normalized = false;
        self.positionsFormat.stride = 0;
        self.positionsFormat.pointer = 0;

        self.positionsBuffer.setVertexAttributeArrayFormat(self.positionsFormat);
    }

    function setupColorsBuffer() {
        self.colorsBuffer = new Buffer(gl, WebGL.BufferType.ArrayBuffer);
        self.colorsBuffer.bind();
        self.colorsBuffer.setBufferData(0, gl.STREAM_DRAW, ParticleSystem.kMaxParticles * 4 * sizeof(float));

        self.colorsFormat = new BufferFormat();
        self.colorsFormat.index = self.shaderProgram.getAttribLocation("aVertexPosition_ModelSpace");
        self.colorsFormat.size = 3;
        self.colorsFormat.type = WebGL.Type.Float;
        self.colorsFormat.normalized = false;
        self.colorsFormat.stride = 0;
        self.colorsFormat.pointer = 0;

        self.colorsBuffer.setVertexAttributeArrayFormat(self.colorsFormat);
    }
}