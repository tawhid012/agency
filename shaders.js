(function () {
  const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const presets = {
    orb: {
      fragment: `
        precision mediump float;
        varying vec2 v_uv;
        uniform float u_time;
        uniform vec2 u_resolution;
        void main() {
          vec2 uv = v_uv;
          vec2 p = (uv - 0.5) * 2.0;
          p.x *= u_resolution.x / max(u_resolution.y, 1.0);
          float d = length(p);
          float glow = 0.06 / (d - 0.28 + 0.16 * sin(u_time * 0.5 + d * 3.0));
          glow = clamp(glow, 0.0, 1.0);
          vec3 color = mix(vec3(0.02, 0.03, 0.05), vec3(0.8, 0.86, 0.95), glow);
          color += vec3(0.8, 0.35, 0.9) * pow(glow, 2.2) * 0.5;
          gl_FragColor = vec4(color * glow, 1.0);
        }
      `
    },
    aurora: {
      fragment: `
        precision mediump float;
        varying vec2 v_uv;
        uniform float u_time;
        void main() {
          vec2 uv = v_uv;
          float wave = sin((uv.x + uv.y) * 6.0 + u_time * 0.8) * 0.5 + 0.5;
          float band = sin((uv.y * 8.0) - u_time * 0.35) * 0.5 + 0.5;
          float glow = smoothstep(0.2, 0.8, band * wave);
          vec3 color = mix(vec3(0.02, 0.03, 0.06), vec3(0.15, 0.45, 0.9), glow);
          color += vec3(0.2, 0.9, 0.7) * pow(glow, 3.0) * 0.3;
          gl_FragColor = vec4(color, 1.0);
        }
      `
    },
    ripple: {
      fragment: `
        precision mediump float;
        varying vec2 v_uv;
        uniform float u_time;
        uniform vec2 u_resolution;
        void main() {
          vec2 uv = v_uv;
          vec2 p = (uv - 0.5) * 2.0;
          p.x *= u_resolution.x / max(u_resolution.y, 1.0);
          float dist = length(p);
          float wave = sin(dist * 8.0 - u_time * 1.2) * 0.5 + 0.5;
          float ring = smoothstep(0.4, 0.0, abs(dist - 0.35 + sin(u_time * 0.5) * 0.08));
          vec3 color = mix(vec3(0.01, 0.01, 0.02), vec3(0.95, 0.7, 0.25), ring * 0.8);
          color += vec3(0.3, 0.4, 1.0) * wave * 0.15;
          gl_FragColor = vec4(color * (0.3 + ring * 0.7), 1.0);
        }
      `
    },
    grid: {
      fragment: `
        precision mediump float;
        varying vec2 v_uv;
        uniform float u_time;
        void main() {
          vec2 uv = v_uv * 14.0;
          float grid = smoothstep(0.9, 1.0, 1.0 - abs(fract(uv.x) - 0.5) * 2.0);
          grid *= smoothstep(0.9, 1.0, 1.0 - abs(fract(uv.y) - 0.5) * 2.0);
          float pulse = sin(u_time * 0.6 + uv.x * 0.2) * 0.5 + 0.5;
          vec3 color = mix(vec3(0.01, 0.01, 0.02), vec3(0.7, 0.2, 0.95), grid * 0.7 + pulse * 0.1);
          color += vec3(0.15, 0.2, 0.95) * pow(grid, 2.0) * 0.25;
          gl_FragColor = vec4(color, 1.0);
        }
      `
    }
  };

  // Cap DPR at 2 for performance on high-DPI mobile screens
  const MAX_DPR = 2;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }

  function initShaderCanvas(canvas, presetName) {
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
    if (!gl) return null;

    const preset = presets[presetName] || presets.orb;
    const program = gl.createProgram();
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, preset.fragment);

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uResolution = gl.getUniformLocation(program, 'u_resolution');

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    resize();

    let rafId = null;
    let resizeHandler = () => resize();
    window.addEventListener('resize', resizeHandler);

    function render(time) {
      resize();
      if (uTime) gl.uniform1f(uTime, time * 0.001);
      if (uResolution) gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    }

    // Return control object for pause/resume
    return {
      start() {
        if (!rafId) {
          rafId = requestAnimationFrame(render);
        }
      },
      stop() {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
      destroy() {
        this.stop();
        window.removeEventListener('resize', resizeHandler);
      }
    };
  }

  function init() {
    const canvases = document.querySelectorAll('canvas[data-shader]');
    
    // Use IntersectionObserver for lazy init — only run shaders when visible
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const canvas = entry.target;
          if (entry.isIntersecting) {
            if (!canvas._shaderCtrl) {
              const presetName = canvas.getAttribute('data-shader') || 'orb';
              canvas._shaderCtrl = initShaderCanvas(canvas, presetName);
            }
            if (canvas._shaderCtrl) canvas._shaderCtrl.start();
          } else {
            if (canvas._shaderCtrl) canvas._shaderCtrl.stop();
          }
        });
      }, { rootMargin: '100px' });

      canvases.forEach((canvas) => observer.observe(canvas));
    } else {
      // Fallback: init all immediately
      canvases.forEach((canvas) => {
        const presetName = canvas.getAttribute('data-shader') || 'orb';
        const ctrl = initShaderCanvas(canvas, presetName);
        if (ctrl) ctrl.start();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.LimuxShaders = { initShaderCanvas, init };
})();
