window.onload = appStart;


function appStart() {
    var image = document.getElementsByTagName('img')[0];
    var canvas = document.getElementsByTagName('canvas')[0];
    window.glContext = canvas.getContext('webgl');
    var gl = new WebGL(glContext);

    var fragmentShaderSource = document.getElementById('fragment-shader').innerText;
    var vertexShaderSource = document.getElementById('vertex-shader').innerText;

    var shader = gl.createShaderProgram(vertexShaderSource, fragmentShaderSource);
    shader.use();

    
    var _2dquad = new Float32Array([
        -1, -1,
         1, -1,
         1,  1,
        -1,  1,        
    ]);

    var _uvquad = new Float32Array([
        0.0, 1.0,        
        1.0, 1.0,
        1.0, 0.0,
        0.0, 0.0,
    ]);

    var _elquad = new Uint16Array([
        0, 1, 2,
        0, 2, 3
    ]);

    var image2 = {
        width: 2,
        height: 2,
        data: new Uint8Array([
            0, 255, 0, 255,
            255, 255, 255, 255, 
            0, 255, 0, 255,
            255, 255, 255, 255
        ])        
    };

    glContext.getExtension("OES_vertex_array_object");
    glContext.enable(glContext.DEPTH_TEST);   
    
    var texture = gl.loadTexture0();    
    texture.loadFromImage(image);
    var textureLocation = shader.getUniformLocation("u_texture"); 
    texture.setTextureLocation(textureLocation);


    // CREATE VERTEX BUFFER
    var positionBuffer = gl.createBufferWithData(_2dquad, glContext.ARRAY_BUFFER)
    var positionBufferFormat = new BufferFormat();
    positionBufferFormat.index = shader.getAttribLocation("aVertexPosition");
    positionBufferFormat.size = 2;
    positionBufferFormat.type = glContext.FLOAT;
    positionBufferFormat.normalized = false;
    positionBufferFormat.stride = 0;
    positionBufferFormat.pointer = 0;
    console.log(positionBufferFormat);
    positionBuffer.setVertexAttributeArrayFormat(positionBufferFormat);


    // CREATE UV BUFFER
    var uvBuffer = gl.createBufferWithData(_uvquad, glContext.ARRAY_BUFFER)
    var uvBufferFormat = new BufferFormat();
    uvBufferFormat.index = shader.getAttribLocation("aTextureCoord");
    uvBufferFormat.size = 2;
    uvBufferFormat.type = glContext.FLOAT;
    uvBufferFormat.normalized = false;
    uvBufferFormat.stride = 0;
    uvBufferFormat.pointer = 0;
    console.log(uvBufferFormat);
    uvBuffer.setVertexAttributeArrayFormat(uvBufferFormat);

    //CREATE INDEX BUFFER
    var indexBuffer = gl.createBufferWithData(_elquad, glContext.ELEMENT_ARRAY_BUFFER);


    function render() {

        // Tell WebGL how to convert from clip space to pixels
        if (glContext.clearDepth) glContext.clearDepth(1.0); 
        else glContext.clearDepthf(1.0);
        glContext.viewport(0, 0, glContext.canvas.width, glContext.canvas.height);
        glContext.clearColor(128, 0, 128, 1);
        glContext.clear(glContext.COLOR_BUFFER_BIT);

        
        // Setup the attributes to pull data from our buffers
        shader.use();
        texture.bind();

        positionBuffer.bind();
        positionBuffer.bindVertexAttributePointerFormat();
        
        uvBuffer.bind();
        uvBuffer.bindVertexAttributePointerFormat();
        
        
        // draw!!!
        indexBuffer.bind();

        var vertexCount = indexBuffer.getLength();
        var indexType = glContext.UNSIGNED_SHORT;
        var offset = 0;

        glContext.drawElements(glContext.TRIANGLES, indexBuffer.getLength(), indexType, offset);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

function loadImage(url, callback) {
    var img = new Image();
    img.addEventListener('load', callback);
    // requestCORSIfNotSameOrigin(img, url);
    img.src = url;
}

function requestCORSIfNotSameOrigin(img, url) {
    if ((new URL(url)).origin !== window.location.origin) {
      img.crossOrigin = "";
    }
  }