function Buffer(glContext, buffertype) {

    var self = this;
    var gl = self.gl = glContext;
    self.bufferType = buffertype;
    self.bufferLocation = gl.createBuffer();
    self.bufferFormat = null;
    self.dataLength = 0;
    self.data = null;

    self.setBufferData = function (data) {
        var drawType = arguments.length > 1 ? arguments[1] : gl.STATIC_DRAW;
        var offset = arguments.length > 2 ? arguments[2] : 0;
        var length = arguments.length > 3 ? arguments[3] : 0;
        self.data = data;
        self.dataLength = data.length;
        gl.bindBuffer(self.bufferType, self.bufferLocation);
        gl.bufferData(self.bufferType, data, drawType, offset, length);
    };

    self.getLength = function() {
        return self.dataLength;
    };
    
    self.setElementType = function(elementType) {
        self.elementType = elementType;
    };

    self.getElementType = function() {
        return self.elementType;
    };

    self.setVertexAttributeArrayFormat = function (bufferFormat) {
        self.bufferFormat = JSON.parse(JSON.stringify(bufferFormat));
    };

    self.bind = function () {
        gl.bindBuffer(self.bufferType, self.bufferLocation);
    };

    self.unbind = function() {
        gl.bindBuffer(self.bufferType, 0);
    }

    self.bindVertexAttributePointerFormat = function() {
        gl.enableVertexAttribArray(self.bufferFormat.index);
        gl.vertexAttribPointer(
            self.bufferFormat.index,
            self.bufferFormat.size,
            self.bufferFormat.type,
            self.bufferFormat.normalized,
            self.bufferFormat.stride,
            self.bufferFormat.pointer
        );
    }
}
