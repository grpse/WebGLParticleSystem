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

    gl.enableDepthTest();    
    
    var texture = gl.load2DTexture0();    
    texture.loadFromImage(image);
    var textureLocation = shader.getUniformLocation("u_texture"); 
    texture.setTextureLocation(textureLocation);


    // CREATE VERTEX BUFFER
    var positionBuffer = gl.createBufferWithData(_2dquad, WebGL.BufferType.ArrayBuffer)
    var positionBufferFormat = new BufferFormat();
    positionBufferFormat.index = shader.getAttribLocation("aVertexPosition");
    positionBufferFormat.size = 2;
    positionBufferFormat.type = WebGL.Type.Float;
    positionBufferFormat.normalized = false;
    positionBufferFormat.stride = 0;
    positionBufferFormat.pointer = 0;
    console.log(positionBufferFormat);
    positionBuffer.setVertexAttributeArrayFormat(positionBufferFormat);


    // CREATE UV BUFFER
    var uvBuffer = gl.createBufferWithData(_uvquad, WebGL.BufferType.ArrayBuffer)
    var uvBufferFormat = new BufferFormat();
    uvBufferFormat.index = shader.getAttribLocation("aTextureCoord");
    uvBufferFormat.size = 2;
    uvBufferFormat.type = WebGL.Type.Float;
    uvBufferFormat.normalized = false;
    uvBufferFormat.stride = 0;
    uvBufferFormat.pointer = 0;
    console.log(uvBufferFormat);
    uvBuffer.setVertexAttributeArrayFormat(uvBufferFormat);

    //CREATE INDEX BUFFER
    var indexBuffer = gl.createBufferWithData(_elquad, WebGL.BufferType.ElementArrayBuffer);
    indexBuffer.setElementType(WebGL.Type.UnsignedShort);


    var particlesVertShader = `
       
    attribute vec3 aVertexPosition_ModelSpace;
    attribute vec4 aColorForParticle;
    
    uniform mat4 WVP;

    varying vec4 particleColor;

    void main() {
        gl_Position = WVP * vec4(aVertexPosition_ModelSpace, 1); 
        particleColor = aColorForParticle;
    }
    `;

    var particlesFragShader = `
    precision highp float;

    varying vec4 particleColor;
    
    void main() {
        gl_FragColor = particleColor;
    }
    `;

    var particleShaderProgram = gl.createShaderProgram(particlesVertShader, particlesFragShader);

    var particleSystem = new ParticleSystem(glContext, particleShaderProgram);

    function render() {

        gl.clear();
        
        // // Setup the attributes to pull data from our buffers
        // shader.use();
        // texture.bind();

        // positionBuffer.bind();
        // positionBuffer.bindVertexAttributePointerFormat();
        
        // uvBuffer.bind();
        // uvBuffer.bindVertexAttributePointerFormat();
        
        
        // // draw!!!
        // indexBuffer.bind();

        // var vertexCount = indexBuffer.getLength();
        // gl.drawElements(indexBuffer);  

        particleShaderProgram.use();
        particleSystem.update();
        particleSystem.draw();

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