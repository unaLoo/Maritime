type ProgramOptions = {
  label?: string
  bindAttribLocations?: Record<string, number>
}

export function createProgram(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string,
  options: ProgramOptions = {},
): WebGLProgram {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource, options.label)
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource, options.label)
  const program = gl.createProgram()!
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  if (options.bindAttribLocations) {
    Object.entries(options.bindAttribLocations).forEach(([name, location]) => {
      gl.bindAttribLocation(program, location, name)
    })
  }

  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(`[GLUtil] Program link error${options.label ? ` (${options.label})` : ''}:`, gl.getProgramInfoLog(program))
  }

  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)
  return program
}

export function createTexture2D(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  internalFormat: number,
  format: number,
  type: number,
  data: ArrayBufferView | null,
  filter: number,
): WebGLTexture {
  const texture = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, data)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.bindTexture(gl.TEXTURE_2D, null)
  return texture
}

export function createTexture2DFromImage(
  gl: WebGL2RenderingContext,
  image: ImageBitmap | HTMLImageElement,
  filter: number = gl.NEAREST,
): WebGLTexture | null {
  const texture = gl.createTexture()
  if (!texture) return null

  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  gl.bindTexture(gl.TEXTURE_2D, null)

  return texture
}

export function createTexture2DArray(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  depth: number,
  internalFormat: number,
  format: number,
  type: number,
  data: ArrayBufferView,
  filter: number = gl.LINEAR,
): WebGLTexture | null {
  const texture = gl.createTexture()
  if (!texture) return null

  const prevUnpackAlignment = gl.getParameter(gl.UNPACK_ALIGNMENT) as number
  const prevFlipY = gl.getParameter(gl.UNPACK_FLIP_Y_WEBGL) as boolean
  const prevPremultiplyAlpha = gl.getParameter(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL) as boolean

  gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture)
  // texSubImage3D does not allow FLIP_Y/PREMULTIPLY_ALPHA to be enabled.
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0)
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0)
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4)
  gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, internalFormat, width, height, depth)
  gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, 0, width, height, depth, format, type, data)
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, filter)
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, filter)
  gl.bindTexture(gl.TEXTURE_2D_ARRAY, null)
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, prevUnpackAlignment)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, prevFlipY ? 1 : 0)
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, prevPremultiplyAlpha ? 1 : 0)

  return texture
}

export function createFramebuffer(
  gl: WebGL2RenderingContext,
  textures: WebGLTexture[],
): WebGLFramebuffer {
  const framebuffer = gl.createFramebuffer()!
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
  textures.forEach((texture, index) => {
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + index, gl.TEXTURE_2D, texture, 0)
  })
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    console.error(`[GLUtil] Framebuffer incomplete, status: 0x${status.toString(16)}`)
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  return framebuffer
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
  label?: string,
): WebGLShader {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const shaderType = type === gl.VERTEX_SHADER ? 'vertex' : 'fragment'
    console.error(
      `[GLUtil] ${shaderType} shader compile error${label ? ` (${label})` : ''}:`,
      gl.getShaderInfoLog(shader),
    )
    gl.deleteShader(shader)
  }
  return shader
}

