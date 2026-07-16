"use client";

import { useEffect, useRef, useState } from "react";
import { mat4, quat, vec2, vec3 } from "gl-matrix";

const discVertexShader = `#version 300 es
uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec4 uRotationAxisVelocity;

in vec3 aModelPosition;
in vec2 aModelUvs;
in mat4 aInstanceMatrix;

out vec2 vUvs;
out float vAlpha;
flat out int vInstanceId;

void main() {
  vec4 worldPosition = uWorldMatrix * aInstanceMatrix * vec4(aModelPosition, 1.0);
  vec3 centerPos = (uWorldMatrix * aInstanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  float radius = length(centerPos);

  if (gl_VertexID > 0) {
    vec3 rotationAxis = uRotationAxisVelocity.xyz;
    float rotationVelocity = min(0.15, uRotationAxisVelocity.w * 15.0);
    vec3 stretchDir = normalize(cross(centerPos, rotationAxis));
    vec3 relativeVertexPos = normalize(worldPosition.xyz - centerPos);
    float strength = dot(stretchDir, relativeVertexPos);
    float invAbsStrength = min(0.0, abs(strength) - 1.0);
    strength = rotationVelocity * sign(strength) * abs(invAbsStrength * invAbsStrength * invAbsStrength + 1.0);
    worldPosition.xyz += stretchDir * strength;
  }

  worldPosition.xyz = radius * normalize(worldPosition.xyz);
  gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;
  vAlpha = smoothstep(0.5, 1.0, normalize(worldPosition.xyz).z) * 0.9 + 0.1;
  vUvs = aModelUvs;
  vInstanceId = gl_InstanceID;
}`;

const discFragmentShader = `#version 300 es
precision highp float;

uniform sampler2D uTex;
uniform int uItemCount;
uniform int uAtlasSize;

out vec4 outColor;
in vec2 vUvs;
in float vAlpha;
flat in int vInstanceId;

void main() {
  int itemIndex = vInstanceId % uItemCount;
  int cellX = itemIndex % uAtlasSize;
  int cellY = itemIndex / uAtlasSize;
  vec2 cellSize = vec2(1.0) / vec2(float(uAtlasSize));
  vec2 cellOffset = vec2(float(cellX), float(cellY)) * cellSize;
  vec2 st = vec2(vUvs.x, 1.0 - vUvs.y);
  st = clamp(st, 0.0, 1.0) * cellSize + cellOffset;
  outColor = texture(uTex, st);
  outColor.a *= vAlpha;
}`;

function hexToUnitRgb(hex) {
  const value = /^#[0-9a-f]{6}$/i.test(hex) ? hex.slice(1) : "151713";
  return [0, 2, 4].map(
    (offset) => Number.parseInt(value.slice(offset, offset + 2), 16) / 255
  );
}

class Face {
  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
}

class Vertex {
  constructor(x, y, z) {
    this.position = vec3.fromValues(x, y, z);
    this.normal = vec3.create();
    this.uv = vec2.create();
  }
}

class Geometry {
  constructor() {
    this.vertices = [];
    this.faces = [];
  }

  addVertex(...values) {
    for (let index = 0; index < values.length; index += 3) {
      this.vertices.push(
        new Vertex(values[index], values[index + 1], values[index + 2])
      );
    }
    return this;
  }

  addFace(...values) {
    for (let index = 0; index < values.length; index += 3) {
      this.faces.push(
        new Face(values[index], values[index + 1], values[index + 2])
      );
    }
    return this;
  }

  subdivide(divisions = 1) {
    const midpointCache = {};
    let faces = this.faces;

    for (let division = 0; division < divisions; division += 1) {
      const nextFaces = new Array(faces.length * 4);
      faces.forEach((face, faceIndex) => {
        const ab = this.getMidpoint(face.a, face.b, midpointCache);
        const bc = this.getMidpoint(face.b, face.c, midpointCache);
        const ca = this.getMidpoint(face.c, face.a, midpointCache);
        const index = faceIndex * 4;
        nextFaces[index] = new Face(face.a, ab, ca);
        nextFaces[index + 1] = new Face(face.b, bc, ab);
        nextFaces[index + 2] = new Face(face.c, ca, bc);
        nextFaces[index + 3] = new Face(ab, bc, ca);
      });
      faces = nextFaces;
    }

    this.faces = faces;
    return this;
  }

  spherize(radius = 1) {
    this.vertices.forEach((vertex) => {
      vec3.normalize(vertex.normal, vertex.position);
      vec3.scale(vertex.position, vertex.normal, radius);
    });
    return this;
  }

  getMidpoint(indexA, indexB, cache) {
    const key =
      indexA < indexB ? `k_${indexB}_${indexA}` : `k_${indexA}_${indexB}`;
    if (Object.prototype.hasOwnProperty.call(cache, key)) return cache[key];

    const a = this.vertices[indexA].position;
    const b = this.vertices[indexB].position;
    const index = this.vertices.length;
    cache[key] = index;
    this.addVertex(
      (a[0] + b[0]) * 0.5,
      (a[1] + b[1]) * 0.5,
      (a[2] + b[2]) * 0.5
    );
    return index;
  }
}

class IcosahedronGeometry extends Geometry {
  constructor() {
    super();
    const t = Math.sqrt(5) * 0.5 + 0.5;
    this.addVertex(
      -1,
      t,
      0,
      1,
      t,
      0,
      -1,
      -t,
      0,
      1,
      -t,
      0,
      0,
      -1,
      t,
      0,
      1,
      t,
      0,
      -1,
      -t,
      0,
      1,
      -t,
      t,
      0,
      -1,
      t,
      0,
      1,
      -t,
      0,
      -1,
      -t,
      0,
      1
    ).addFace(
      0,
      11,
      5,
      0,
      5,
      1,
      0,
      1,
      7,
      0,
      7,
      10,
      0,
      10,
      11,
      1,
      5,
      9,
      5,
      11,
      4,
      11,
      10,
      2,
      10,
      7,
      6,
      7,
      1,
      8,
      3,
      9,
      4,
      3,
      4,
      2,
      3,
      2,
      6,
      3,
      6,
      8,
      3,
      8,
      9,
      4,
      9,
      5,
      2,
      4,
      11,
      6,
      2,
      10,
      8,
      6,
      7,
      9,
      8,
      1
    );
  }
}

class DiscGeometry extends Geometry {
  constructor(steps = 56, radius = 1) {
    super();
    const alpha = (2 * Math.PI) / steps;
    this.addVertex(0, 0, 0);
    this.vertices[0].uv = vec2.fromValues(0.5, 0.5);

    for (let index = 0; index < steps; index += 1) {
      const x = Math.cos(alpha * index);
      const y = Math.sin(alpha * index);
      this.addVertex(radius * x, radius * y, 0);
      this.vertices.at(-1).uv = vec2.fromValues(x * 0.5 + 0.5, y * 0.5 + 0.5);
      if (index > 0) this.addFace(0, index, index + 1);
    }
    this.addFace(0, steps, 1);
  }
}

function createProgram(gl, vertexSource, fragmentSource) {
  const program = gl.createProgram();
  if (!program) throw new Error("Unable to create WebGL program");
  const shaders = [];

  try {
    [
      [gl.VERTEX_SHADER, vertexSource],
      [gl.FRAGMENT_SHADER, fragmentSource],
    ].forEach(([type, source]) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Unable to create WebGL shader");

      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message =
          gl.getShaderInfoLog(shader) || "Shader compilation failed";
        gl.deleteShader(shader);
        throw new Error(message);
      }
      shaders.push(shader);
      gl.attachShader(program, shader);
    });

    gl.bindAttribLocation(program, 0, "aModelPosition");
    gl.bindAttribLocation(program, 1, "aModelUvs");
    gl.bindAttribLocation(program, 2, "aInstanceMatrix");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || "Shader linking failed");
    }

    shaders.forEach((shader) => {
      gl.detachShader(program, shader);
      gl.deleteShader(shader);
    });
    return program;
  } catch (error) {
    shaders.forEach((shader) => gl.deleteShader(shader));
    gl.deleteProgram(program);
    throw error;
  }
}

function makeBuffer(gl, data, usage = gl.STATIC_DRAW) {
  const buffer = gl.createBuffer();
  if (!buffer) throw new Error("Unable to create WebGL buffer");
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, usage);
  return buffer;
}

class ArcballControl {
  constructor(canvas, onUpdate) {
    this.canvas = canvas;
    this.onUpdate = onUpdate;
    this.isPointerDown = false;
    this.pointerPos = vec2.create();
    this.previousPointerPos = vec2.create();
    this.orientation = quat.create();
    this.pointerRotation = quat.create();
    this.combinedQuat = quat.create();
    this.rotationVelocity = 0;
    this.smoothedRotationVelocity = 0;
    this.rotationAxis = vec3.fromValues(1, 0, 0);
    this.snapDirection = vec3.fromValues(0, 0, -1);
    this.snapTargetDirection = null;

    this.onPointerDown = (event) => {
      vec2.set(this.pointerPos, event.clientX, event.clientY);
      vec2.copy(this.previousPointerPos, this.pointerPos);
      this.isPointerDown = true;
      this.canvas.setPointerCapture?.(event.pointerId);
    };
    this.onPointerUp = () => {
      this.isPointerDown = false;
    };
    this.onPointerMove = (event) => {
      if (this.isPointerDown)
        vec2.set(this.pointerPos, event.clientX, event.clientY);
    };

    canvas.addEventListener("pointerdown", this.onPointerDown);
    canvas.addEventListener("pointerup", this.onPointerUp);
    canvas.addEventListener("pointercancel", this.onPointerUp);
    canvas.addEventListener("pointerleave", this.onPointerUp);
    canvas.addEventListener("pointermove", this.onPointerMove);
  }

  project(position) {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const size = Math.max(width, height) - 1;
    const x = (2 * position[0] - width - 1) / size;
    const y = (2 * position[1] - height - 1) / size;
    const xySquared = x * x + y * y;
    const z =
      xySquared <= 2 ? Math.sqrt(4 - xySquared) : 4 / Math.sqrt(xySquared);
    return vec3.fromValues(-x, y, z);
  }

  rotationBetween(a, b, output, factor) {
    const axis = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), a, b));
    const dot = Math.max(-1, Math.min(1, vec3.dot(a, b)));
    quat.setAxisAngle(output, axis, Math.acos(dot) * factor);
  }

  update(deltaTime, targetFrameDuration) {
    const timeScale = deltaTime / targetFrameDuration + 0.00001;
    let angleFactor = timeScale;
    const snapRotation = quat.create();

    if (this.isPointerDown) {
      const delta = vec2.sub(
        vec2.create(),
        this.pointerPos,
        this.previousPointerPos
      );
      vec2.scale(delta, delta, 0.3 * timeScale);
      if (vec2.sqrLen(delta) > 0.1) {
        vec2.add(delta, this.previousPointerPos, delta);
        const a = vec3.normalize(vec3.create(), this.project(delta));
        const b = vec3.normalize(
          vec3.create(),
          this.project(this.previousPointerPos)
        );
        vec2.copy(this.previousPointerPos, delta);
        angleFactor *= 5 / timeScale;
        this.rotationBetween(a, b, this.pointerRotation, angleFactor);
      } else {
        quat.slerp(
          this.pointerRotation,
          this.pointerRotation,
          quat.create(),
          0.3 * timeScale
        );
      }
    } else {
      quat.slerp(
        this.pointerRotation,
        this.pointerRotation,
        quat.create(),
        0.1 * timeScale
      );
      if (this.snapTargetDirection) {
        const squaredDistance = vec3.squaredDistance(
          this.snapTargetDirection,
          this.snapDirection
        );
        angleFactor *= 0.2 * Math.max(0.1, 1 - squaredDistance * 10);
        this.rotationBetween(
          this.snapTargetDirection,
          this.snapDirection,
          snapRotation,
          angleFactor
        );
      }
    }

    const combined = quat.multiply(
      quat.create(),
      snapRotation,
      this.pointerRotation
    );
    quat.multiply(this.orientation, combined, this.orientation);
    quat.normalize(this.orientation, this.orientation);
    quat.slerp(this.combinedQuat, this.combinedQuat, combined, 0.8 * timeScale);
    quat.normalize(this.combinedQuat, this.combinedQuat);

    const radians = Math.acos(this.combinedQuat[3]) * 2;
    const sine = Math.sin(radians / 2);
    let velocity = 0;
    if (sine > 0.000001) {
      velocity = radians / (2 * Math.PI);
      this.rotationAxis = vec3.fromValues(
        this.combinedQuat[0] / sine,
        this.combinedQuat[1] / sine,
        this.combinedQuat[2] / sine
      );
    }
    this.smoothedRotationVelocity +=
      (velocity - this.smoothedRotationVelocity) * 0.5 * timeScale;
    this.rotationVelocity = this.smoothedRotationVelocity / timeScale;
    this.onUpdate(deltaTime);
  }

  isSettled() {
    const snapDistance = this.snapTargetDirection
      ? vec3.squaredDistance(this.snapTargetDirection, this.snapDirection)
      : 0;

    return (
      !this.isPointerDown &&
      Math.abs(this.rotationVelocity) < 0.0005 &&
      snapDistance < 0.00001
    );
  }

  destroy() {
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("pointerup", this.onPointerUp);
    this.canvas.removeEventListener("pointercancel", this.onPointerUp);
    this.canvas.removeEventListener("pointerleave", this.onPointerUp);
    this.canvas.removeEventListener("pointermove", this.onPointerMove);
  }
}

class InfiniteGridMenu {
  constructor(
    canvas,
    items,
    onActiveItemChange,
    onMovementChange,
    scale = 1,
    onRenderNeeded = () => {}
  ) {
    this.canvas = canvas;
    this.items = items;
    this.onActiveItemChange = onActiveItemChange;
    this.onMovementChange = onMovementChange;
    this.onRenderNeeded = onRenderNeeded;
    this.scale = scale;
    this.radius = 2;
    this.targetFrameDuration = 1000 / 30;
    this.lastTime = 0;
    this.activeIndex = 0;
    this.backgroundColor = hexToUnitRgb(this.items[0]?.background ?? "#151713");
    this.movementActive = false;
    this.frame = null;
    this.running = false;
    this.idleFrames = 0;
    this.destroyed = false;
    this.textureGeneration = 0;
    this.buffers = [];
    this.vertexArray = null;
    this.texture = null;
    this.program = null;
    this.camera = {
      near: 0.1,
      far: 40,
      fov: Math.PI / 4,
      aspect: 1,
      position: vec3.fromValues(0, 0, 3 * scale),
      up: vec3.fromValues(0, 1, 0),
      matrix: mat4.create(),
      view: mat4.create(),
      projection: mat4.create(),
    };
    try {
      this.initialize();
    } catch (error) {
      this.destroy();
      throw error;
    }
  }

  initialize() {
    const gl = this.canvas.getContext("webgl2", {
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) throw new Error("WebGL 2 is unavailable");
    this.gl = gl;
    this.program = createProgram(gl, discVertexShader, discFragmentShader);
    this.locations = {
      modelPosition: gl.getAttribLocation(this.program, "aModelPosition"),
      modelUvs: gl.getAttribLocation(this.program, "aModelUvs"),
      instanceMatrix: gl.getAttribLocation(this.program, "aInstanceMatrix"),
      world: gl.getUniformLocation(this.program, "uWorldMatrix"),
      view: gl.getUniformLocation(this.program, "uViewMatrix"),
      projection: gl.getUniformLocation(this.program, "uProjectionMatrix"),
      rotation: gl.getUniformLocation(this.program, "uRotationAxisVelocity"),
      texture: gl.getUniformLocation(this.program, "uTex"),
      itemCount: gl.getUniformLocation(this.program, "uItemCount"),
      atlasSize: gl.getUniformLocation(this.program, "uAtlasSize"),
    };

    const disc = new DiscGeometry();
    const vertices = new Float32Array(
      disc.vertices.flatMap((vertex) => Array.from(vertex.position))
    );
    const uvs = new Float32Array(
      disc.vertices.flatMap((vertex) => Array.from(vertex.uv))
    );
    this.indices = new Uint16Array(
      disc.faces.flatMap((face) => [face.a, face.b, face.c])
    );

    this.vertexArray = gl.createVertexArray();
    if (!this.vertexArray)
      throw new Error("Unable to create WebGL vertex array");
    gl.bindVertexArray(this.vertexArray);
    this.buffers.push(makeBuffer(gl, vertices));
    gl.enableVertexAttribArray(this.locations.modelPosition);
    gl.vertexAttribPointer(
      this.locations.modelPosition,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
    this.buffers.push(makeBuffer(gl, uvs));
    gl.enableVertexAttribArray(this.locations.modelUvs);
    gl.vertexAttribPointer(this.locations.modelUvs, 2, gl.FLOAT, false, 0, 0);
    const indexBuffer = gl.createBuffer();
    if (!indexBuffer) throw new Error("Unable to create WebGL index buffer");
    this.buffers.push(indexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    const ico = new IcosahedronGeometry().subdivide(1).spherize(this.radius);
    this.instancePositions = ico.vertices.map((vertex) => vertex.position);
    this.instanceMatricesArray = new Float32Array(
      this.instancePositions.length * 16
    );
    this.instanceMatrices = this.instancePositions.map((_, index) => {
      const matrix = new Float32Array(
        this.instanceMatricesArray.buffer,
        index * 16 * 4,
        16
      );
      matrix.set(mat4.create());
      return matrix;
    });
    this.instanceBuffer = makeBuffer(
      gl,
      this.instanceMatricesArray.byteLength,
      gl.DYNAMIC_DRAW
    );
    this.buffers.push(this.instanceBuffer);
    for (let column = 0; column < 4; column += 1) {
      const location = this.locations.instanceMatrix + column;
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 4, gl.FLOAT, false, 64, column * 16);
      gl.vertexAttribDivisor(location, 1);
    }
    gl.bindVertexArray(null);

    this.worldMatrix = mat4.create();
    this.initializeTexture();
    this.control = new ArcballControl(this.canvas, (delta) =>
      this.updateControl(delta)
    );
    this.wake = () => this.start();
    this.canvas.addEventListener("pointerdown", this.wake);
    this.resize();
    this.onActiveItemChange(this.activeIndex);
  }

  initializeTexture() {
    const gl = this.gl;
    const generation = ++this.textureGeneration;
    this.texture = gl.createTexture();
    if (!this.texture) throw new Error("Unable to create WebGL texture");
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    this.atlasSize = Math.ceil(Math.sqrt(Math.max(1, this.items.length)));
    const atlas = document.createElement("canvas");
    const cellSize = 512;
    atlas.width = this.atlasSize * cellSize;
    atlas.height = this.atlasSize * cellSize;
    const context = atlas.getContext("2d");
    if (!context) throw new Error("Unable to create the project texture atlas");

    context.fillStyle = "#171813";
    context.fillRect(0, 0, atlas.width, atlas.height);
    this.items.forEach((item, index) => {
      const x = (index % this.atlasSize) * cellSize;
      const y = Math.floor(index / this.atlasSize) * cellSize;
      context.fillStyle = item.background ?? "#151713";
      context.fillRect(x, y, cellSize, cellSize);
    });

    Promise.all(
      this.items.map(
        (item) =>
          new Promise((resolve) => {
            const image = new Image();
            image.crossOrigin = "anonymous";
            image.onload = () => resolve(image);
            image.onerror = () => resolve(null);
            image.src = item.image;
          })
      )
    ).then((images) => {
      if (
        this.destroyed ||
        generation !== this.textureGeneration ||
        gl.isContextLost() ||
        !this.texture
      ) {
        return;
      }

      images.forEach((image, index) => {
        const x = (index % this.atlasSize) * cellSize;
        const y = Math.floor(index / this.atlasSize) * cellSize;
        if (image) {
          const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
          const sourceX = (image.naturalWidth - sourceSize) / 2;
          const sourceY = (image.naturalHeight - sourceSize) / 2;
          context.drawImage(
            image,
            sourceX,
            sourceY,
            sourceSize,
            sourceSize,
            x,
            y,
            cellSize,
            cellSize
          );
        }
      });
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        atlas
      );
      gl.generateMipmap(gl.TEXTURE_2D);
      this.onRenderNeeded();
    });

    const initialColor = hexToUnitRgb(
      this.items[0]?.background ?? "#151713"
    ).map((channel) => Math.round(channel * 255));
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([...initialColor, 255])
    );
  }

  resize() {
    const gl = this.gl;
    if (this.destroyed || !gl || gl.isContextLost()) return;

    const dpr = Math.min(1.35, window.devicePixelRatio || 1);
    const clientWidth = Math.max(1, this.canvas.clientWidth);
    const clientHeight = Math.max(1, this.canvas.clientHeight);
    const width = Math.max(1, Math.round(clientWidth * dpr));
    const height = Math.max(1, Math.round(clientHeight * dpr));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    gl.viewport(0, 0, width, height);
    this.camera.aspect = clientWidth / clientHeight;
    const viewHeight = this.radius * 0.35;
    const distance = this.camera.position[2];
    this.camera.fov =
      this.camera.aspect > 1
        ? 2 * Math.atan(viewHeight / distance)
        : 2 * Math.atan(viewHeight / this.camera.aspect / distance);
    mat4.perspective(
      this.camera.projection,
      this.camera.fov,
      this.camera.aspect,
      this.camera.near,
      this.camera.far
    );
  }

  updateCamera() {
    mat4.targetTo(
      this.camera.matrix,
      this.camera.position,
      [0, 0, 0],
      this.camera.up
    );
    mat4.invert(this.camera.view, this.camera.matrix);
  }

  findNearestVertex() {
    const inverseOrientation = quat.conjugate(
      quat.create(),
      this.control.orientation
    );
    const target = vec3.transformQuat(
      vec3.create(),
      this.control.snapDirection,
      inverseOrientation
    );
    let nearestIndex = 0;
    let maximumDot = -1;
    this.instancePositions.forEach((position, index) => {
      const dot = vec3.dot(target, position);
      if (dot > maximumDot) {
        maximumDot = dot;
        nearestIndex = index;
      }
    });
    return nearestIndex;
  }

  updateControl(deltaTime) {
    const timeScale = deltaTime / this.targetFrameDuration + 0.0001;
    let damping = 5 / timeScale;
    let cameraTargetZ = 3 * this.scale;
    const moving =
      this.control.isPointerDown ||
      Math.abs(this.control.rotationVelocity) > 0.01;

    if (moving !== this.movementActive) {
      this.movementActive = moving;
      this.onMovementChange(moving);
    }

    if (!this.control.isPointerDown) {
      const nearestVertex = this.findNearestVertex();
      const itemIndex = nearestVertex % this.items.length;
      if (itemIndex !== this.activeIndex) {
        this.activeIndex = itemIndex;
        this.backgroundColor = hexToUnitRgb(
          this.items[itemIndex]?.background ?? "#151713"
        );
        this.onActiveItemChange(itemIndex);
      }
      this.control.snapTargetDirection = vec3.normalize(
        vec3.create(),
        vec3.transformQuat(
          vec3.create(),
          this.instancePositions[nearestVertex],
          this.control.orientation
        )
      );
    } else {
      cameraTargetZ += this.control.rotationVelocity * 80 + 2.5;
      damping = 7 / timeScale;
    }
    this.camera.position[2] +=
      (cameraTargetZ - this.camera.position[2]) / damping;
    this.updateCamera();
  }

  animate(deltaTime) {
    this.control.update(deltaTime, this.targetFrameDuration);
    const gl = this.gl;
    this.instancePositions.forEach((position, index) => {
      const transformed = vec3.transformQuat(
        vec3.create(),
        position,
        this.control.orientation
      );
      const scale = (Math.abs(transformed[2]) / this.radius) * 0.6 + 0.4;
      const matrix = mat4.create();
      mat4.translate(matrix, matrix, vec3.negate(vec3.create(), transformed));
      mat4.multiply(
        matrix,
        matrix,
        mat4.targetTo(mat4.create(), [0, 0, 0], transformed, [0, 1, 0])
      );
      mat4.scale(matrix, matrix, [scale * 0.25, scale * 0.25, scale * 0.25]);
      mat4.translate(matrix, matrix, [0, 0, -this.radius]);
      mat4.copy(this.instanceMatrices[index], matrix);
    });
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.instanceMatricesArray);
  }

  render() {
    const gl = this.gl;
    if (this.destroyed || !gl || gl.isContextLost()) return;

    gl.useProgram(this.program);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(...this.backgroundColor, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(this.locations.world, false, this.worldMatrix);
    gl.uniformMatrix4fv(this.locations.view, false, this.camera.view);
    gl.uniformMatrix4fv(
      this.locations.projection,
      false,
      this.camera.projection
    );
    gl.uniform4f(
      this.locations.rotation,
      this.control.rotationAxis[0],
      this.control.rotationAxis[1],
      this.control.rotationAxis[2],
      this.control.rotationVelocity * 1.1
    );
    gl.uniform1i(this.locations.itemCount, this.items.length);
    gl.uniform1i(this.locations.atlasSize, this.atlasSize);
    gl.uniform1i(this.locations.texture, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.bindVertexArray(this.vertexArray);
    gl.drawElementsInstanced(
      gl.TRIANGLES,
      this.indices.length,
      gl.UNSIGNED_SHORT,
      0,
      this.instancePositions.length
    );
  }

  run = (time = 0) => {
    if (
      !this.running ||
      this.destroyed ||
      !this.gl ||
      this.gl.isContextLost()
    ) {
      this.stop();
      return;
    }
    const elapsed =
      this.lastTime === 0 ? this.targetFrameDuration : time - this.lastTime;

    if (elapsed >= this.targetFrameDuration) {
      const deltaTime = Math.min(48, elapsed);
      this.lastTime = time;
      this.animate(deltaTime);
      this.render();

      this.idleFrames = this.control.isSettled() ? this.idleFrames + 1 : 0;
      if (this.idleFrames > 8) {
        this.stop();
        return;
      }
    }

    this.frame = requestAnimationFrame(this.run);
  };

  start() {
    if (this.running || this.destroyed || !this.gl || this.gl.isContextLost()) {
      return;
    }
    this.running = true;
    this.lastTime = 0;
    this.idleFrames = 0;
    this.frame = requestAnimationFrame(this.run);
  }

  stop() {
    this.running = false;
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    this.frame = null;
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.textureGeneration += 1;
    this.stop();
    if (this.wake) this.canvas.removeEventListener("pointerdown", this.wake);
    this.control?.destroy();

    const gl = this.gl;
    if (gl && !gl.isContextLost()) {
      gl.bindVertexArray(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.useProgram(null);
      this.buffers.filter(Boolean).forEach((buffer) => gl.deleteBuffer(buffer));
      if (this.vertexArray) gl.deleteVertexArray(this.vertexArray);
      if (this.texture) gl.deleteTexture(this.texture);
      if (this.program) gl.deleteProgram(this.program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }

    this.buffers = [];
    this.vertexArray = null;
    this.texture = null;
    this.program = null;
    this.control = null;
    this.onRenderNeeded = () => {};
    this.gl = null;
  }
}

/**
 * @typedef {Object} InfiniteMenuItem
 * @property {string} image
 * @property {string} link
 * @property {string} title
 * @property {string} kicker
 * @property {string} description
 * @property {string} [background]
 */

/**
 * @param {{ items?: InfiniteMenuItem[], scale?: number }} props
 */
export default function InfiniteMenu({ items = [], scale = 1 }) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const [activeItem, setActiveItem] = useState(items[0] ?? null);
  const [isMoving, setIsMoving] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas || items.length === 0) return undefined;

    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!finePointer || reducedMotion || !("IntersectionObserver" in window)) {
      let mounted = true;
      queueMicrotask(() => {
        if (mounted) setIsSupported(false);
      });
      return () => {
        mounted = false;
      };
    }

    let menu;
    let isIntersecting = false;
    let hasAttemptedInitialization = false;
    let disposed = false;

    const isActive = () =>
      isIntersecting && document.visibilityState === "visible";
    const requestRender = () => {
      if (!disposed && isActive()) menu?.start();
    };
    const ensureMenu = () => {
      if (menu || hasAttemptedInitialization || disposed) return;
      hasAttemptedInitialization = true;

      try {
        menu = new InfiniteGridMenu(
          canvas,
          items,
          (index) => setActiveItem(items[index]),
          setIsMoving,
          scale,
          requestRender
        );
      } catch {
        queueMicrotask(() => {
          if (!disposed) setIsSupported(false);
        });
      }
    };

    const updateActivity = () => {
      if (isActive()) {
        ensureMenu();
        menu?.start();
      } else {
        menu?.stop();
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        updateActivity();
      },
      { rootMargin: "180px", threshold: 0.01 }
    );
    const resize = () => {
      menu?.resize();
      if (isActive()) menu?.start();
    };
    const resizeObserver =
      "ResizeObserver" in window ? new ResizeObserver(resize) : null;

    observer.observe(root);
    resizeObserver?.observe(root);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", updateActivity);
    return () => {
      disposed = true;
      observer.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", updateActivity);
      menu?.destroy();
    };
  }, [items, scale]);

  const openActiveItem = () => {
    if (!activeItem?.link) return;
    window.open(activeItem.link, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="infinite-menu-root"
      ref={rootRef}
      style={{
        "--menu-background": activeItem?.background ?? "#151713",
      }}
    >
      <canvas
        aria-label="Interactive globe of selected projects. Drag to explore."
        className="infinite-menu-canvas"
        ref={canvasRef}
      />

      {!isSupported ? (
        <div className="infinite-menu-fallback">
          {items.map((item) => (
            <button
              key={item.title}
              onClick={() =>
                window.open(item.link, "_blank", "noopener,noreferrer")
              }
              type="button"
            >
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </button>
          ))}
        </div>
      ) : null}

      {activeItem ? (
        <>
          <div
            className={`infinite-menu-title ${isMoving ? "infinite-menu-inactive" : "infinite-menu-active"}`}
          >
            <span>{activeItem.kicker}</span>
            <h3>{activeItem.title}</h3>
          </div>
          <p
            className={`infinite-menu-description ${isMoving ? "infinite-menu-inactive" : "infinite-menu-active"}`}
          >
            {activeItem.description}
          </p>
          <button
            aria-label={`Open ${activeItem.title} on GitHub`}
            className={`infinite-menu-action ${isMoving ? "infinite-menu-inactive" : "infinite-menu-active"}`}
            onClick={openActiveItem}
            type="button"
          >
            <span aria-hidden="true">↗</span>
          </button>
        </>
      ) : null}
    </div>
  );
}
