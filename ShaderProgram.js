function ShaderProgram(glContext) {

    var self = this;
    var gl = self.gl = glContext;
    self.shaderProgram = null;
    self.vertexProgram = null;
    self.fragmentProgram = null;

    self.compile = function (vertShaderSource, fragShaderSource) {
        self.vertexProgram = compileVertexShader(vertShaderSource);
        self.fragmentProgram = compileFragmentShader(fragShaderSource);
        self.shaderProgram = createProgram(gl, self.vertexProgram, self.fragmentProgram);
    };

    self.use = function () {
        gl.useProgram(self.shaderProgram);
    };

    self.getAttribLocation = function (attributeName) {
        return gl.getAttribLocation(self.shaderProgram, attributeName);
    };

    self.getUniformLocation = function (uniformLocation) {
        return gl.getUniformLocation(self.shaderProgram, uniformLocation);
    }

    function compileVertexShader(vertexShaderSource) {
        return compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    };

    function compileFragmentShader(fragmentShaderSource) {
        return compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    };

    /**
     * Creates and compiles a shader.
     *
     * @param {!WebGLRenderingContext} gl The WebGL Context.
     * @param {string} shaderSource The GLSL source code for the shader.
     * @param {number} shaderType The type of shader, VERTEX_SHADER or
     *     FRAGMENT_SHADER.
     * @return {!WebGLShader} The shader.
     */
    function compileShader(gl, shaderSource, shaderType) {
        // Create the shader object
        var shader = gl.createShader(shaderType);

        // Set the shader source code.
        gl.shaderSource(shader, shaderSource);

        // Compile the shader
        gl.compileShader(shader);

        // Check if it compiled
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success) {
            // Something went wrong during compilation; get the error
            throw "could not compile shader:" + gl.getShaderInfoLog(shader);
        }

        return shader;
    }

    /**
     * Creates a program from 2 shaders.
     *
     * @param {!WebGLRenderingContext) gl The WebGL context.
     * @param {!WebGLShader} vertexShader A vertex shader.
     * @param {!WebGLShader} fragmentShader A fragment shader.
     * @return {!WebGLProgram} A program.
     */
    function createProgram(gl, vertexShader, fragmentShader) {
        // create a program.
        var program = gl.createProgram();

        // attach the shaders.
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        // link the program.
        gl.linkProgram(program);

        // Check if it linked.
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!success) {
            // something went wrong with the link
            throw ("program filed to link:" + gl.getProgramInfoLog(program));
        }

        return program;
    };
}