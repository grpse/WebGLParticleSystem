function WebGL(glContext) {
    var self = this;

    var gl = self.gl = glContext;

    self.loadTexture0 = function (img) {
        return new Texture(gl, 0);
    };

    self.loadTexture1 = function (img) {
        return new Texture(gl, 1);
    };

    self.createShaderProgram = function(vertShaderSource, fragShaderSource) {
        var shaderProgram = new ShaderProgram(gl);
        shaderProgram.compile(vertShaderSource, fragShaderSource);
        return shaderProgram;
    };

    self.createBufferWithData = function(data, bufferType) {
        var buffer = new Buffer(glContext, bufferType);
        buffer.setBufferData(data);
        return buffer;
    };
}