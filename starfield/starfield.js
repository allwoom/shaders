var _gl = null;
var _drawBuffer = null;
var _vertexShader = null;
var _fragmentShader = null;
var _program = null;

// Shader parameters
var _timeLoc = null;
var _lastTime = 0;
var _elapsedTime = 0;
var _resolutionLoc = null;

function onLoad() {
    initProgram();

    if (_gl) {
        requestAnimationFrame(render);
    }
}

function logError(e) {
    console.error(e);
    log(e, '#cc3333');
}

function log(msg, color){
    color = color || "#999";
    var output = document.getElementById("console");

    if (output) {
        var writeableMessage = msg;

        if (typeof msg == "object") {
            writeableMessage = JSON.stringify(msg);
        }

        writeableMessage = writeableMessage.split("\n").join("<br/>");
        output.innerHTML += "<span style='color:" + color + "'>" + writeableMessage + "</span><br/>";
    }
}

function onWindowResize() {
    // update resolution if relevant
}

function initProgram() {
    try {
        const canvas = document.querySelector("#glCanvas");

        // Initialize the GL context
        _gl = canvas.getContext("webgl");

        // Only continue if WebGL is available and working
        if (_gl === null) {
            throw ("Unable to initialize WebGL. Your browser or machine may not support it.");
        }

        var vertexShaderSource = document.getElementById("vertexShader").text;
        _vertexShader = compileShader(_gl, vertexShaderSource, _gl.VERTEX_SHADER);

        var fragmentShaderSource = document.getElementById("fragmentShader").text;
        _fragmentShader = compileShader(_gl, fragmentShaderSource, _gl.FRAGMENT_SHADER);

        _program = createProgram(_gl, [_vertexShader, _fragmentShader]);

        _drawBuffer = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, _drawBuffer);
        _gl.bufferData(
            _gl.ARRAY_BUFFER,
            new Float32Array([-1.0, -1.0,
                1.0, -1.0, -1.0, 1.0, -1.0, 1.0,
                1.0, -1.0,
                1.0, 1.0
            ]),
            _gl.STATIC_DRAW
        );

        // Draw with our program active
        _gl.useProgram(_program);

        // Find and intialize shader uniforms
        _timeLoc = _gl.getUniformLocation(_program, "time");
        _resolutionLoc = _gl.getUniformLocation(_program, "resolution");

        _gl.uniform1f(_timeLoc, _elapsedTime);
        _gl.uniform2fv(_resolutionLoc, [canvas.clientWidth, canvas.clientHeight]);

        _lastTime = performance.now();

        log("initialized")
    } catch (e) {
        logError(e);
    }
}

function render(time) {
    var elapsed = (time - _lastTime)/ 1000.0;
    _lastTime = time;

    // Update shader variable(s)
    _gl.uniform1f(_timeLoc, _elapsedTime += elapsed);

    // Set clear color to black, fully opaque
    _gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    _gl.clear(_gl.COLOR_BUFFER_BIT);

    var positionLocation = _gl.getAttribLocation(_program, "a_position");
    _gl.enableVertexAttribArray(positionLocation);
    _gl.vertexAttribPointer(positionLocation, 2, _gl.FLOAT, false, 0, 0);
    _gl.drawArrays(_gl.TRIANGLES, 0, 6);

    requestAnimationFrame(render);
}


window.addEventListener('resize', onWindowResize, false);
window.addEventListener('load', onLoad);