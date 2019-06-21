
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
* @param {!WebGLShader[]} shaders
* @return {!WebGLProgram} A program.
*/
function createProgram(gl, shaders) {
  // create a program.
  var program = gl.createProgram();

  // attach the shaders.
  for (var s in shaders) {
    gl.attachShader(program, shaders[s]);
  }

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

/**
* Map a value in one range to a value in another range
* @param {Number} value 
* @param {Number} min1 
* @param {Number} max1 
* @param {Number} min2 
* @param {Number} max2 
*/
function mapValue(value, min1, max1, min2, max2) {
  var percent = (value - min1) / (max1 - min1);

  return percent * (max2 - min2) + min2;
}