function WebGL(glContext) {
    var self = this;
    var gl = self.gl = glContext;

    WebGL.Type = {
        UnsignedByte  : gl.UNSIGNED_BYTE,
        UnsignedShort : gl.UNSIGNED_SHORT,
        UnsignedInt   : gl.UNSIGNED_INT,
        Float         : gl.FLOAT
    };

    WebGL.BufferType = {
        ElementArrayBuffer : gl.ELEMENT_ARRAY_BUFFER,
        ArrayBuffer        : gl.ARRAY_BUFFER
    };

    self.clearMask = 0;

    self.enableDepthTest = function() {
        gl.enable(gl.DEPTH_TEST);
        self.clearMask |= gl.DEPTH_BUFFER_BIT;
    };

    self.load2DTexture0 = function (img) {
        return new Texture2D(gl, 0);
    };

    self.load2DTexture1 = function (img) {
        return new Texture2D(gl, 1);
    };

    self.createShaderProgram = function(vertShaderSource, fragShaderSource) {
        var shaderProgram = new ShaderProgram(gl);
        shaderProgram.compile(vertShaderSource, fragShaderSource);
        return shaderProgram;
    };

    self.createBufferWithData = function(data, bufferType) {
        var buffer = new Buffer(gl, bufferType);
        buffer.setBufferData(data);
        return buffer;
    };

    self.clear = function() {
        // Tell WebGL how to convert from clip space to pixels
        if (gl.clearDepth) gl.clearDepth(1.0); 
        else gl.clearDepthf(1.0);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    };

    self.drawElements = function(indexBuffer) {
        gl.drawElements(gl.TRIANGLES, indexBuffer.getLength(), indexBuffer.getElementType(), 0);
    }
}