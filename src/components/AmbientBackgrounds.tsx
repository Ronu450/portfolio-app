import { useEffect, useRef } from "react";

export function RotatingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      console.error("Rotating stars background could not create a 2D canvas.");
      return;
    }

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let frameId = 0;
    let isVisible = false;
    let elapsed = 0;

    const draw = (time: number) => {
      elapsed = time;
      context.clearRect(0, 0, width, height);
      if (width === 0 || height === 0) return;

      const centerX = width / 2;
      const centerY = height / 2;
      const unit = Math.min(width, height);

      for (let orbit = 0; orbit < 10; orbit += 1) {
        const radius = unit * (0.12 + orbit * 0.075);
        const orbitRotation = orbit * 0.19;
        const ellipseY = 0.58;

        context.save();
        context.translate(centerX, centerY);
        context.rotate(orbitRotation);
        context.beginPath();
        context.ellipse(0, 0, radius, radius * ellipseY, 0, 0, Math.PI * 2);
        context.strokeStyle = `rgba(116, 157, 190, ${0.035 + (orbit % 3) * 0.012})`;
        context.lineWidth = 1;
        context.stroke();
        context.restore();

        const starCount = 2 + (orbit % 3);
        for (let star = 0; star < starCount; star += 1) {
          const direction = orbit % 2 === 0 ? 1 : -1;
          const angularSpeed = direction * (0.000055 + orbit * 0.000006);
          const angle =
            (star / starCount) * Math.PI * 2 +
            orbit * 0.47 +
            time * angularSpeed;
          const localX = Math.cos(angle) * radius;
          const localY = Math.sin(angle) * radius * ellipseY;
          const x =
            centerX +
            localX * Math.cos(orbitRotation) -
            localY * Math.sin(orbitRotation);
          const y =
            centerY +
            localX * Math.sin(orbitRotation) +
            localY * Math.cos(orbitRotation);
          const tangentX = -Math.sin(angle) * direction;
          const tangentY = Math.cos(angle) * ellipseY * direction;
          const trailLength = 8 + (orbit % 4) * 3;
          const alpha = 0.28 + (star % 2) * 0.2;

          context.save();
          context.translate(x, y);
          context.rotate(orbitRotation);
          context.beginPath();
          context.moveTo(0, 0);
          context.lineTo(-tangentX * trailLength, -tangentY * trailLength);
          context.strokeStyle = `rgba(164, 203, 231, ${alpha * 0.55})`;
          context.lineWidth = 1;
          context.stroke();
          context.beginPath();
          context.arc(0, 0, 1.2 + (orbit % 3) * 0.35, 0, Math.PI * 2);
          context.fillStyle = `rgba(214, 233, 248, ${alpha})`;
          context.shadowColor = "rgba(105, 164, 204, 0.8)";
          context.shadowBlur = 9;
          context.fill();
          context.restore();
        }
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      draw(elapsed);
    };

    const stop = () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const animate = (time: number) => {
      draw(time);
      frameId = window.requestAnimationFrame(animate);
    };

    const updateAnimation = () => {
      stop();
      if (motionPreference.matches || !isVisible) {
        draw(motionPreference.matches ? 0 : elapsed);
        return;
      }
      frameId = window.requestAnimationFrame(animate);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      updateAnimation();
    });
    visibilityObserver.observe(canvas);
    motionPreference.addEventListener("change", updateAnimation);

    return () => {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      motionPreference.removeEventListener("change", updateAnimation);
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

export function RisingLinesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      console.error("Rising lines background could not create a 2D canvas.");
      return;
    }

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let width = 0;
    let height = 0;
    let frameId = 0;
    let isVisible = false;
    let elapsed = 0;

    const draw = (time: number) => {
      elapsed = time;
      context.clearRect(0, 0, width, height);
      if (!width || !height) return;

      const horizonY = height * 0.76;
      const horizon = context.createLinearGradient(0, horizonY, 0, height);
      horizon.addColorStop(0, "rgba(82, 124, 159, 0.16)");
      horizon.addColorStop(1, "rgba(82, 124, 159, 0)");
      context.fillStyle = horizon;
      context.fillRect(0, horizonY - 1, width, height - horizonY + 1);
      context.beginPath();
      context.moveTo(0, horizonY);
      context.lineTo(width, horizonY);
      context.strokeStyle = "rgba(115, 157, 190, 0.12)";
      context.lineWidth = 1;
      context.stroke();

      const laneCount = Math.max(24, Math.min(56, Math.round(width / 20)));
      const riseSpan = height * 0.92;
      for (let i = 0; i < laneCount; i += 1) {
        const lane = (i / (laneCount - 1) - 0.5) * 2;
        const seed = (i * 0.61803398875) % 1;
        const speed = 0.035 + (i % 5) * 0.008;
        const progress = motionPreference.matches
          ? 0.34 + seed * 0.52
          : (seed + time * speed) % 1;
        const headY = horizonY - progress * riseSpan;
        const spread = 0.1 + progress * 0.72;
        const drift = Math.sin(time * 0.24 + i * 0.73) * width * 0.008;
        const headX = width * (0.5 + lane * spread) + drift;
        const tailLength = height * (0.08 + seed * 0.06);
        const endY = Math.min(height, headY + tailLength);
        const endX = headX - lane * tailLength * 0.13;
        const trail = context.createLinearGradient(headX, headY, endX, endY);
        trail.addColorStop(0, "rgba(190, 218, 237, 0.8)");
        trail.addColorStop(0.18, "rgba(115, 157, 190, 0.42)");
        trail.addColorStop(1, "rgba(66, 106, 140, 0)");

        context.beginPath();
        context.moveTo(headX, headY);
        context.quadraticCurveTo(
          headX - lane * tailLength * 0.05,
          headY + tailLength * 0.48,
          endX,
          endY,
        );
        context.strokeStyle = trail;
        context.lineWidth = 0.7 + seed * 0.8;
        context.shadowColor = "rgba(105, 164, 204, 0.65)";
        context.shadowBlur = 7;
        context.stroke();
        context.shadowBlur = 0;

        if (i % 3 === 0) {
          context.beginPath();
          context.arc(headX, headY, 1 + seed * 0.65, 0, Math.PI * 2);
          context.fillStyle = "rgba(210, 231, 247, 0.8)";
          context.fill();
        }
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      draw(elapsed);
    };

    const stop = () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const animate = (time: number) => {
      draw(time / 1000);
      frameId = window.requestAnimationFrame(animate);
    };

    const updateAnimation = () => {
      stop();
      if (motionPreference.matches || !isVisible) {
        draw(motionPreference.matches ? 0 : elapsed);
        return;
      }
      frameId = window.requestAnimationFrame(animate);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      updateAnimation();
    });
    visibilityObserver.observe(canvas);
    motionPreference.addEventListener("change", updateAnimation);

    return () => {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      motionPreference.removeEventListener("change", updateAnimation);
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

const vertexShaderSource = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentShaderSource = `#version 300 es
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  uv.x *= u_resolution.x / u_resolution.y;
  float t = u_time * 0.16;

  float y1 = 0.50 + 0.13 * sin(uv.x * 2.2 + t)
    + 0.035 * sin(uv.x * 5.4 - t * 0.7);
  float y2 = 0.36 + 0.10 * sin(uv.x * 1.8 - t * 0.72 + 1.1)
    + 0.025 * sin(uv.x * 4.0 + t * 0.5);
  float y3 = 0.67 + 0.08 * sin(uv.x * 2.8 + t * 0.54 + 2.4);

  float d1 = abs(uv.y - y1);
  float d2 = abs(uv.y - y2);
  float d3 = abs(uv.y - y3);
  float glow1 = exp(-d1 * 8.0);
  float glow2 = exp(-d2 * 7.0);
  float glow3 = exp(-d3 * 8.0);
  float line1 = exp(-d1 * 42.0);
  float line2 = exp(-d2 * 34.0);
  float line3 = exp(-d3 * 38.0);

  vec3 color = vec3(0.10, 0.28, 0.43) * glow1
    + vec3(0.18, 0.38, 0.54) * glow2
    + vec3(0.24, 0.34, 0.43) * glow3
    + vec3(0.26, 0.52, 0.70) * line1
    + vec3(0.36, 0.57, 0.71) * line2
    + vec3(0.38, 0.48, 0.58) * line3;
  float alpha = clamp(
    max(max(glow1, glow2), glow3) * 0.12
      + max(max(line1, line2), line3) * 0.16,
    0.0,
    0.24
  );

  outColor = vec4(color, alpha);
}`;

export function ShaderWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl2", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
    });
    if (!canvas || !gl) {
      console.error("Shader waves background requires WebGL 2 support.");
      return;
    }

    const compileShader = (
      type: number,
      source: string,
    ): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) {
        console.error("Shader waves background could not create a shader.");
        return null;
      }
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(
          "Shader waves background failed to compile:",
          gl.getShaderInfoLog(shader),
        );
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderSource,
    );
    if (!vertexShader || !fragmentShader) {
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      console.error("Shader waves background could not create a program.");
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(
        "Shader waves background failed to link:",
        gl.getProgramInfoLog(program),
      );
      gl.deleteProgram(program);
      return;
    }

    const positionBuffer = gl.createBuffer();
    if (!positionBuffer) {
      console.error("Shader waves background could not create a buffer.");
      gl.deleteProgram(program);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.useProgram(program);
    const positionLocation = gl.getAttribLocation(program, "position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.clearColor(0, 0, 0, 0);

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let frameId = 0;
    let isVisible = false;
    let elapsed = 0;

    const render = (time: number) => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      const bufferWidth = Math.round(width * pixelRatio);
      const bufferHeight = Math.round(height * pixelRatio);
      if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
        canvas.width = bufferWidth;
        canvas.height = bufferHeight;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, time);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      elapsed = time;
    };

    const stop = () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
    };

    let startTime = 0;
    const animate = (time: number) => {
      render((time - startTime) / 1000);
      frameId = window.requestAnimationFrame(animate);
    };

    const updateAnimation = () => {
      stop();
      if (motionPreference.matches || !isVisible) {
        render(motionPreference.matches ? 0 : elapsed);
        return;
      }
      startTime = performance.now() - elapsed * 1000;
      frameId = window.requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => render(elapsed));
    resizeObserver.observe(canvas);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      updateAnimation();
    });
    visibilityObserver.observe(canvas);
    motionPreference.addEventListener("change", updateAnimation);
    render(0);

    return () => {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      motionPreference.removeEventListener("change", updateAnimation);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(66,106,140,0.14),transparent_70%)]" />
      <canvas ref={canvasRef} className="relative block h-full w-full" />
    </div>
  );
}
