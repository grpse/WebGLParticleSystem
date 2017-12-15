function Particle() {
    var self = this;

    self.position = vec3.create();
    self.speed = vec3.create();
    self.size = 0;
    self.angle = 0;
    self.weight = 0;
    self.life = 0;
}

function ParticleSystem(glContext, shaderProgram) {

    var self = this;
    var gl = self.gl = glContext;
    var ParticlesCount = 0;
    self.shaderProgram = shaderProgram;
    self.ParticlesContainer = [];
    var extension = gl.getExtension('ANGLE_instanced_arrays');

    ParticleSystem.kMaxParticles = 50;

    self.quad = new Float32Array([
        -1, -1,
         1, -1,
         1,  1,
        -1,  1,        
    ]);

    init();
    function init() {
        setupBillboard();
        setupPositionsBuffer();
        setupColorsBuffer();
    }

    self.instantiate = function(numberOfParticles) {
        for(var i = 0; i < numberOfParticles; i++) {
            var particle = new Particle();
            self.ParticlesContainer.push(particle);
        }
    };

    self.update = function() {
        updatePositions();
        updateColors();
    }

    self.draw = function draw() {
        // gl.VertexAttribDivisor(0, 0); // particles vertices : always reuse the same 4 vertices -> 0
        // gl.VertexAttribDivisor(1, 1); // positions : one per quad (its center) -> 1
        // gl.VertexAttribDivisor(2, 1); // color : one per quad -> 1
        
        // Draw the particules !
        // This draws many times a small triangle_strip (which looks like a quad).
        // This is equivalent to :
        // for(i in ParticlesCount) : glDrawArrays(GL_TRIANGLE_STRIP, 0, 4),
        // but faster.
        extension.drawArraysInstancedANGLE(gl.TRIANGLE_STRIP, 0, 4, ParticlesCount);
    }

    function updatePositions() {

    }

    function updateColors() {

    }



    var LastUsedParticle = 0;
    
    // Finds a Particle in ParticlesContainer which isn't used yet.
    // (i.e. life < 0);
    function FindUnusedParticle(){
    
        for(var i=LastUsedParticle; i<MaxParticles; i++){
            if (self.ParticlesContainer[i].life < 0){
                LastUsedParticle = i;
                return i;
            }
        }
    
        for(var i=0; i<LastUsedParticle; i++){
            if (self.ParticlesContainer[i].life < 0){
                LastUsedParticle = i;
                return i;
            }
        }
    
        return 0; // All particles are taken, override the first one
    }

    function SimulateParticles() {
        // Simulate all particles
        ParticlesCount = 0;
        for(var  i=0; i<MaxParticles; i++){

            var p = ParticlesContainer[i]; // shortcut

            if(p.life > 0.0){

                // Decrease life
                p.life -= delta;
                if (p.life > 0.0){

                    // Simulate simple physics : gravity only, no collisions
                    p.speed += vec3.create(0.0,-9.81, 0.0) * delta * 0.5;

                    p.pos += p.speed * delta;
                    var vecToTakeLengthFrom = vec3.create();
                    vec3.subtract(vecToTakeLengthFrom, p.pos, CameraPosition);
                    p.cameradistance = vec3.length(vecToTakeLengthFrom);
                    //ParticlesContainer[i].pos += glm::vec3(0.0f,10.0f, 0.0f) * (float)delta;

                    // Fill the GPU buffer
                    self.ParticlesContainer[4*ParticlesCount+0] = p.pos.x;
                    self.ParticlesContainer[4*ParticlesCount+1] = p.pos.y;
                    self.ParticlesContainer[4*ParticlesCount+2] = p.pos.z;

                    self.ParticlesContainer[4*ParticlesCount+3] = p.size;

                    self.ParticlesContainer[4*ParticlesCount+0] = p.r;
                    self.ParticlesContainer[4*ParticlesCount+1] = p.g;
                    self.ParticlesContainer[4*ParticlesCount+2] = p.b;
                    self.ParticlesContainer[4*ParticlesCount+3] = p.a;

                }else{
                    // Particles that just died will be put at the end of the buffer in SortParticles();
                    p.cameradistance = -1.0;
                }

                ParticlesCount++;

            }
        }
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
        self.positionsBuffer.setBufferData(0, gl.STREAM_DRAW, 0, ParticleSystem.kMaxParticles * 4 * 4); //sizeof(float));

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
        self.colorsBuffer.setBufferData(0, gl.STREAM_DRAW, ParticleSystem.kMaxParticles * 4 * 4); //sizeof(float));

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