function Texture(glContext, level) {
    var self = this;
    var gl = self.gl = glContext;
    self.image = null;
    self.level = level;
    self.textureLocation = null;
    self.wasDataSet = false;

    self.loadFromImage = function(image) {
        self.image = image;
        
        self.textureBuffer = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, self.textureBuffer);
        gl.texImage2D(gl.TEXTURE_2D, self.level, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // let's assume all images are not a power of 2
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }

        self.wasDataSet = true;
    }

    self.setTextureLocation = function(textureLocation) {
        self.textureLocation = textureLocation;
    }

    self.bind = function() {
        if (self.wasDataSet) {
            
            gl.uniform1i(self.textureLocation, self.level);
            gl.activeTexture(gl.TEXTURE0 + self.level);
            gl.bindTexture(gl.TEXTURE_2D, self.textureBuffer);
        }
    }

    function isPowerOf2(value) {
        return (value & (value - 1)) == 0;
    }
}
