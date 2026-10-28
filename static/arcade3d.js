/* arcade3d.js (window.L1_3D): what the 3D arcade games share.
 *
 * - stage(): a WebGL renderer, scene, camera and lights, sized to its host and with a soft image-based light.
 * - bend(): the bent horizon of endless runners (far things sink below the horizon), added to any material.
 * - build helpers: rounded and vertex-coloured parts merged into one mesh per object (few draw calls on phones).
 * - textTexture(): live text (words, signs, the address plaque) drawn on a canvas texture.
 * - Sparks: small bursts of glittering particles.
 * - shakespeare(): the 3D Shakespeare of the art packs (high forehead, brown shoulder-length curls, glasses, moustache,
 *   pointed beard, black doublet, white collar and cuffs, puffed breeches, buckled shoes), a jointed figure whose poses
 *   are set by code: run, jump, slide, lean, stumble, fly, idle, wave, cheer, keeper and row.
 * - person(): the same body with another face, hair and kit, for footballers and keepers.
 * - HEROES / hero() / heroKit(): the six made-up children (boys and girls) the student plays in every game, in everyday
 *   clothes or a football kit; portrait(): a still picture of one of them for the 2D pages.
 * Needs window.THREE (static/vendor/three-*.min.js), loaded by L1_Arcade.need3D().
 */
(function (window) {
  "use strict";
  const T = () => window.THREE;

  // ------------------------------------------------------------------ renderer and stage
  function supported() {
    try {
      const c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
    } catch (e) { return false; }
  }
  /* host: the element the canvas fills. o: { fov, near, far, shadows, maxDpr, background } */
  function stage(host, o) {
    const THREE = T();
    o = o || {};
    const renderer = new THREE.WebGLRenderer({ antialias: (window.devicePixelRatio || 1) < 2.2, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, o.maxDpr || 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = o.exposure || 1.05;
    renderer.shadowMap.enabled = o.shadows !== false;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const canvas = renderer.domElement;
    canvas.className = "ac-canvas";
    host.appendChild(canvas);
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = o.envIntensity == null ? 0.55 : o.envIntensity;
    pmrem.dispose();
    const camera = new THREE.PerspectiveCamera(o.fov || 60, 1, o.near || 0.1, o.far || 400);
    const st = {
      THREE, renderer, scene, camera, canvas, w: 1, h: 1,
      resize() {
        const w = Math.max(1, host.clientWidth), h = Math.max(1, host.clientHeight);
        if (w === st.w && h === st.h) return false;
        st.w = w; st.h = h;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        return true;
      },
      render() { renderer.render(scene, camera); },
      dispose() {
        try { st.ro && st.ro.disconnect(); } catch (e) { /* none */ }
        scene.traverse((ob) => {
          if (ob.geometry && !ob.geometry.userData.shared) ob.geometry.dispose();
          const mats = ob.material ? (Array.isArray(ob.material) ? ob.material : [ob.material]) : [];
          mats.forEach((m) => { if (m.userData && m.userData.shared) return; if (m.map && !m.map.userData.shared) m.map.dispose(); m.dispose(); });
        });
        if (scene.environment) scene.environment.dispose();
        renderer.dispose();
        canvas.remove();
      },
    };
    if (window.ResizeObserver) { st.ro = new ResizeObserver(() => st.resize()); st.ro.observe(host); }
    st.resize();
    return st;
  }
  // A sunny sky: a big sphere with a vertical gradient (no fog on it) and a few cloud puffs near the horizon.
  function sky(scene, top, horizon, opts) {
    const THREE = T();
    opts = opts || {};
    const g = new THREE.SphereGeometry(opts.radius || 300, 24, 12);
    const m = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: { top: { value: new THREE.Color(top) }, bottom: { value: new THREE.Color(horizon) } },
      vertexShader: "varying float vy; void main(){ vy = normalize(position).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "uniform vec3 top; uniform vec3 bottom; varying float vy; void main(){ float k = smoothstep(-0.05, 0.55, vy); gl_FragColor = vec4(mix(bottom, top, k), 1.0); \n#include <colorspace_fragment>\n }",
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.renderOrder = -10;
    scene.add(mesh);
    return mesh;
  }

  // ------------------------------------------------------------------ the bent horizon
  const curve = { value: 0 };
  function bend(material) {
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uCurve = curve;
      shader.vertexShader = "uniform float uCurve;\n" + shader.vertexShader.replace("#include <project_vertex>",
        "#include <project_vertex>\n  mvPosition.y -= uCurve * mvPosition.z * mvPosition.z;\n  gl_Position = projectionMatrix * mvPosition;");
    };
    material.customProgramCacheKey = () => "l1bend";
    return material;
  }

  // ------------------------------------------------------------------ building blocks
  const _m = () => new (T().Matrix4)();
  /* One coloured part for a merged mesh: geometry g, colour, then position [x,y,z], rotation [x,y,z], scale [x,y,z]. */
  function part(g, color, pos, rot, scl) {
    const THREE = T();
    const m = _m();
    m.compose(new THREE.Vector3(...(pos || [0, 0, 0])), new THREE.Quaternion().setFromEuler(new THREE.Euler(...(rot || [0, 0, 0]))), new THREE.Vector3(...(scl || [1, 1, 1])));
    let geo = g.index ? g.toNonIndexed() : g.clone();
    geo.applyMatrix4(m);
    ["uv", "uv1", "uv2"].forEach((a) => geo.deleteAttribute(a));
    const c = new THREE.Color(color);
    const n = geo.attributes.position.count, arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b; }
    geo.setAttribute("color", new THREE.BufferAttribute(arr, 3));
    return geo;
  }
  function merge(parts) { const g = T().mergeGeometries(parts, false); g.computeBoundingSphere(); return g; }
  const shapes = {};
  function shape(name) {
    const THREE = T();
    if (shapes[name]) return shapes[name];
    const make = {
      box: () => new THREE.BoxGeometry(1, 1, 1),
      rbox: () => new THREE.RoundedBoxGeometry(1, 1, 1, 3, 0.12),
      sphere: () => new THREE.SphereGeometry(0.5, 18, 12),
      lowsphere: () => new THREE.IcosahedronGeometry(0.5, 1),
      cyl: () => new THREE.CylinderGeometry(0.5, 0.5, 1, 16),
      frustum: () => new THREE.CylinderGeometry(0.3, 0.5, 1, 18), // narrower at the top: a tunic, a scarf round the neck
      cone: () => new THREE.ConeGeometry(0.5, 1, 14),
      prism: () => { // a roof: a triangle extruded along z, base 1 wide on y = 0, peak at y = 1
        const s = new THREE.Shape(); s.moveTo(-0.5, 0); s.lineTo(0.5, 0); s.lineTo(0, 1); s.lineTo(-0.5, 0);
        const g = new THREE.ExtrudeGeometry(s, { depth: 1, bevelEnabled: false }); g.translate(0, 0, -0.5); return g;
      },
      torus: () => new THREE.TorusGeometry(0.5, 0.12, 8, 24),
      smile: () => new THREE.TorusGeometry(0.5, 0.16, 6, 14, Math.PI).rotateZ(Math.PI), // a U: half a ring
    };
    shapes[name] = make[name]();
    shapes[name].userData.shared = true;
    return shapes[name];
  }
  const mats = {};
  // Shared materials: vertex-coloured (bent or flat), and plain colours by name.
  function vcMaterial(bent, opts) {
    const k = "vc" + (bent ? "b" : "") + JSON.stringify(opts || {});
    if (!mats[k]) {
      const C = window.L1_3D && window.L1_3D.cinema; // the animated-movie look: soft cel shading
      const m = C ? C.toonMaterial(Object.assign({ vertexColors: true }, opts || {}))
        : new (T().MeshStandardMaterial)(Object.assign({ vertexColors: true, roughness: 0.82, metalness: 0 }, opts || {}));
      if (bent) bend(m);
      m.userData.shared = true;
      mats[k] = m;
    }
    return mats[k];
  }
  function mat(color, opts, bent) {
    const k = color + JSON.stringify(opts || {}) + (bent ? "b" : "");
    if (!mats[k]) {
      const C = window.L1_3D && window.L1_3D.cinema;
      const m = C ? C.toonMaterial(Object.assign({ color }, opts || {}))
        : new (T().MeshStandardMaterial)(Object.assign({ color, roughness: 0.7, metalness: 0 }, opts || {}));
      if (bent) bend(m);
      m.userData.shared = true;
      mats[k] = m;
    }
    return mats[k];
  }

  // ------------------------------------------------------------------ canvas text
  /* A texture with text: o { w, h, bg (colour or null), color, font (css weight+family), size, lines, round, border } */
  function textTexture(text, o) {
    const THREE = T();
    o = o || {};
    const c = document.createElement("canvas");
    c.width = o.w || 512; c.height = o.h || 128;
    const g = c.getContext("2d");
    if (o.paint) o.paint(g, c);
    else if (o.bg) {
      g.fillStyle = o.bg;
      const r = o.round || 0;
      g.beginPath();
      if (g.roundRect) g.roundRect(0, 0, c.width, c.height, r); else g.rect(0, 0, c.width, c.height);
      g.fill();
      if (o.border) { g.lineWidth = o.borderW || 10; g.strokeStyle = o.border; g.stroke(); }
    }
    let size = o.size || Math.round(c.height * 0.5);
    const family = o.font || '800 SIZEpx "Plus Jakarta Sans", system-ui, sans-serif';
    g.font = family.replace("SIZE", size);
    const maxW = c.width * (o.fit || 0.86);
    const tw = g.measureText(text).width;
    if (tw > maxW) { size = Math.floor(size * maxW / tw); g.font = family.replace("SIZE", size); }
    g.textAlign = "center";
    g.textBaseline = "middle";
    if (o.shadow) { g.fillStyle = o.shadow; g.fillText(text, c.width / 2 + 2, c.height / 2 + (o.dy || 0) + 3); }
    g.fillStyle = o.color || "#272d35";
    g.fillText(text, c.width / 2, c.height / 2 + (o.dy || 0));
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }
  // A picture (image or canvas) as a texture.
  function pictureTexture(img) {
    const THREE = T();
    const tex = new THREE.Texture(img);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  }

  // ------------------------------------------------------------------ sparkles
  // Glittering bursts: one Points object, particles with a velocity and a life; additive, so they glow over anything.
  function Sparks(scene, max, bent) {
    const THREE = T();
    max = max || 240;
    const pos = new Float32Array(max * 3), col = new Float32Array(max * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const dot = document.createElement("canvas");
    dot.width = dot.height = 64;
    const g = dot.getContext("2d");
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(255,255,255,1)"); grd.addColorStop(0.35, "rgba(255,255,255,.8)"); grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    const m = new THREE.PointsMaterial({ size: 0.28, map: pictureTexture(dot), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    if (bent) bend(m);
    const pts = new THREE.Points(geo, m);
    pts.frustumCulled = false;
    scene.add(pts);
    const ps = [];
    for (let i = 0; i < max; i++) ps.push({ life: 0, x: 0, y: -99, z: 0, vx: 0, vy: 0, vz: 0, c: new THREE.Color() });
    let cursor = 0;
    return {
      points: pts,
      burst(x, y, z, color, n, speed, life, gravity) {
        const base = new THREE.Color(color);
        for (let i = 0; i < (n || 20); i++) {
          const p = ps[cursor]; cursor = (cursor + 1) % max;
          const a = Math.random() * Math.PI * 2, b = Math.random() * Math.PI - Math.PI / 2, s = (speed || 3) * (0.4 + Math.random() * 0.8);
          Object.assign(p, { x, y, z, vx: Math.cos(a) * Math.cos(b) * s, vy: Math.sin(b) * s + (speed || 3) * 0.4, vz: Math.sin(a) * Math.cos(b) * s, life: (life || 0.7) * (0.6 + Math.random() * 0.6), g: gravity == null ? 6 : gravity });
          p.c.copy(base).offsetHSL((Math.random() - 0.5) * 0.06, 0, (Math.random() - 0.3) * 0.25);
        }
      },
      update(dt, shiftZ) {
        for (let i = 0; i < max; i++) {
          const p = ps[i];
          if (p.life > 0) {
            p.life -= dt;
            p.vy -= p.g * dt;
            p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt + (shiftZ || 0);
          }
          const k = Math.max(0, Math.min(1, p.life * 2));
          pos[i * 3] = p.x; pos[i * 3 + 1] = p.life > 0 ? p.y : -99; pos[i * 3 + 2] = p.z;
          col[i * 3] = p.c.r * k; col[i * 3 + 1] = p.c.g * k; col[i * 3 + 2] = p.c.b * k;
        }
        geo.attributes.position.needsUpdate = true;
        geo.attributes.color.needsUpdate = true;
      },
    };
  }

  // ------------------------------------------------------------------ people
  const SKIN = "#f1c29a";
  /* A jointed figure facing -z (away from a camera behind it). Joints are groups, so poses are rotations:
     a leg or arm hanging down moves forward with +x rotation; the spine and neck lean forward with -x rotation.
     look: { kit: "kid" | "shakespeare" | "football" | "keeper", shirt, shorts, socks, skin, hair, hairStyle, beard, glasses,
             number, trousers, tunic, trim, sole, accent, hijab, longSleeves, leggings }
     The "kid" kit is everyday clothes: long sleeves, trousers, sneakers. hijab (a colour) covers hair, ears and neck;
     longSleeves and leggings cover arms and legs in a football kit. */
  function figure(look) {
    const THREE = T();
    look = look || {};
    const kit = look.kit || "shakespeare";
    const kid = kit === "kid";
    const skin = look.skin || SKIN;
    const shirt = look.shirt || "#17171c", socks = look.socks || "#1b1b20";
    const shorts = kid ? (look.trousers || "#2b3445") : look.shorts || "#202027";
    const shoe = look.shoe || "#111114", hair = look.hair || "#5b3a22";
    const legSkin = kid ? shorts : look.leggings || skin; // what shows between shorts and socks
    const white = "#f7f2e7";
    // every joint gathers coloured parts; at the end each joint becomes ONE mesh (about 16 draw calls per figure)
    const bins = new Map();
    const put = (joint, geo, color, pos, scl, rot) => {
      if (!bins.has(joint)) bins.set(joint, []);
      bins.get(joint).push(part(geo, color, pos, rot, scl));
    };
    const capsule = (r, len) => {
      const k = "cap" + r + "_" + len;
      if (!shapes[k]) { shapes[k] = new THREE.CapsuleGeometry(r, len, 5, 12); shapes[k].userData.shared = true; }
      return shapes[k];
    };
    const joint = (parent, x, y, z) => { const j = new THREE.Group(); j.position.set(x, y, z); parent.add(j); return j; };

    const root = new THREE.Group();
    const body = joint(root, 0, 0, 0); // leans and rolls as a whole
    const pelvis = joint(body, 0, 0.88, 0);
    const J = { root, body, pelvis };
    ["L", "R"].forEach((s, i) => {
      const side = i === 0 ? -1 : 1;
      const hip = joint(pelvis, side * 0.1, -0.02, 0);
      put(hip, capsule(0.085, 0.24), kit === "shakespeare" ? socks : look.thigh || legSkin, [0, -0.17, 0]);
      const knee = joint(hip, 0, -0.34, 0);
      put(knee, capsule(0.07, 0.26), kit === "shakespeare" ? socks : legSkin, [0, -0.17, 0]);
      if (kid) put(knee, capsule(0.078, 0.06), shorts, [0, -0.3, 0]); // the trouser hem over the sneaker
      else if (kit !== "shakespeare") put(knee, capsule(0.076, 0.2), socks, [0, -0.2, 0]);
      const ankle = joint(knee, 0, -0.35, 0);
      put(ankle, shape("rbox"), shoe, [0, -0.035, -0.06], [0.13, 0.09, 0.27]);
      if (kit === "shakespeare") put(ankle, shape("box"), "#d8b04a", [0, 0.012, -0.15], [0.08, 0.035, 0.02]);
      else if (kid) put(ankle, shape("rbox"), look.sole || "#ffffff", [0, -0.072, -0.06], [0.14, 0.03, 0.28]); // sneaker sole
      else put(ankle, shape("box"), look.bootStripe || "#ffffff", [side * 0.066, -0.03, -0.06], [0.005, 0.03, 0.18]);
      J["hip" + s] = hip; J["knee" + s] = knee; J["ankle" + s] = ankle;
    });
    if (kit === "shakespeare") {
      put(pelvis, shape("sphere"), shorts, [0, -0.06, 0], [0.44, 0.32, 0.34]);
      for (let k = 0; k < 8; k++) { // slashed panes on the puffed breeches
        const a = (k / 8) * Math.PI * 2;
        put(pelvis, shape("box"), "#33333d", [Math.sin(a) * 0.195, -0.06, Math.cos(a) * 0.145], [0.025, 0.21, 0.025], [0, a, 0]);
      }
    } else {
      if (look.tunic) put(pelvis, shape("frustum"), look.tunic, [0, -0.1, 0], [0.66, 0.34, 0.52]); // a long top over the trousers
      else put(pelvis, shape("rbox"), shorts, [0, -0.07, 0], [0.37, 0.22, 0.25]);
    }
    const spine = joint(pelvis, 0, 0.06, 0);
    J.spine = spine;
    put(spine, capsule(0.17, 0.22), shirt, [0, 0.24, 0], [1.06, 1, 0.8]);
    if (kid) {
      const trim = look.trim || new THREE.Color(shirt).offsetHSL(0, 0, -0.12);
      put(spine, shape("cyl"), trim, [0, 0.47, 0], [0.2, 0.03, 0.17]); // collar
      put(spine, shape("cyl"), trim, [0, 0.06, 0], [0.37, 0.05, 0.29]); // hem
      put(spine, shape("cyl"), look.accent || "#ffffff", [0, 0.3, -0.142], [0.1, 0.012, 0.1], [Math.PI / 2, 0, 0]); // a round badge
    }
    if (kit === "shakespeare") {
      for (let k = 0; k < 6; k++) put(spine, shape("sphere"), "#cfc8b8", [0, 0.1 + k * 0.055, -0.138], [0.026, 0.026, 0.02]);
      put(spine, shape("cyl"), "#0d0d10", [0, 0.06, 0], [0.37, 0.045, 0.3]);
      put(spine, shape("cyl"), white, [0, 0.47, 0.0], [0.42, 0.04, 0.36], [0.12, 0, 0]); // the broad white collar
      put(spine, shape("cone"), white, [0, 0.42, -0.13], [0.16, 0.12, 0.05], [Math.PI, 0, 0]);
    } else if (!kid) {
      put(spine, shape("cyl"), look.trim || "#ffffff", [0, 0.47, 0], [0.2, 0.03, 0.17]);
      put(spine, shape("box"), look.trim || "#ffffff", [0, 0.24, -0.14], [0.012, 0.3, 0.01]);
    }
    ["L", "R"].forEach((s, i) => {
      const side = i === 0 ? -1 : 1;
      const shoulder = joint(spine, side * 0.22, 0.39, 0);
      if (kit === "shakespeare") put(shoulder, shape("sphere"), shirt, [side * 0.02, 0, 0], [0.2, 0.18, 0.18]);
      put(shoulder, capsule(0.06, 0.18), kit === "football" ? (look.sleeve || shirt) : shirt, [0, -0.14, 0]);
      const elbow = joint(shoulder, 0, -0.27, 0);
      put(elbow, capsule(0.055, 0.16), kit === "football" && !look.longSleeves ? skin : (look.sleeve || shirt), [0, -0.12, 0]);
      const wrist = joint(elbow, 0, -0.25, 0);
      if (kit === "shakespeare") put(wrist, shape("cyl"), white, [0, 0.02, 0], [0.15, 0.06, 0.15]);
      const glove = kit === "keeper" || look.gloves;
      put(wrist, shape("sphere"), glove ? (look.glove || "#f2f2f2") : skin, [0, -0.05, 0], glove ? [0.16, 0.18, 0.1] : [0.11, 0.12, 0.09]);
      J["shoulder" + s] = shoulder; J["elbow" + s] = elbow; J["wrist" + s] = wrist;
    });
    const neck = joint(spine, 0, 0.5, 0);
    put(neck, shape("cyl"), look.hijab || skin, [0, 0.03, 0], look.hijab ? [0.15, 0.12, 0.15] : [0.11, 0.1, 0.11]);
    if (look.hijab) { // the scarf falls over the neck, the shoulders and the top of the chest
      put(spine, shape("frustum"), look.hijab, [0, 0.47, 0.01], [0.42, 0.16, 0.36]);
      put(spine, shape("cone"), look.hijab, [0, 0.37, -0.125], [0.24, 0.2, 0.07], [Math.PI, 0, 0]);
    }
    const head = joint(neck, 0, 0.22, 0);
    head.scale.setScalar(look.headScale || (kid ? 1.28 : 1.22)); // a cartoon head, like the art packs' figures
    J.neck = neck; J.head = head;
    put(head, shape("sphere"), skin, [0, 0.01, 0], [0.31, 0.36, 0.32]); // a high forehead: an egg-shaped head
    put(head, shape("sphere"), skin, [-0.155, -0.01, 0.02], [0.06, 0.09, 0.05]);
    put(head, shape("sphere"), skin, [0.155, -0.01, 0.02], [0.06, 0.09, 0.05]);
    put(head, shape("sphere"), new THREE.Color(skin).offsetHSL(0, 0.08, -0.05), [0, -0.02, -0.165], [0.06, 0.06, 0.07]);
    const eye = kid ? 1.18 : 1; // children get bigger eyes and rosy cheeks
    [-1, 1].forEach((side) => {
      put(head, shape("sphere"), "#ffffff", [side * 0.058, 0.035, -0.142], [0.045 * eye, 0.04 * eye, 0.025]);
      put(head, shape("sphere"), "#2a1a10", [side * 0.058, 0.035, -0.153], [0.024 * eye, 0.026 * eye, 0.012]);
      put(head, shape("sphere"), "#ffffff", [side * 0.058 + 0.008, 0.045, -0.16], [0.008, 0.008, 0.004]); // a glint
      put(head, shape("box"), look.brow || hair, [side * 0.06, 0.092, -0.15], [0.07, 0.016, 0.02], [0, 0, side * -0.12]);
      if (kid) put(head, shape("sphere"), "#f29a8e", [side * 0.098, -0.05, -0.128], [0.05, 0.028, 0.02]);
    });
    if (look.hijab) {
      // a rounded scarf round the face: the face stays open in front, hair and ears are covered
      put(head, shape("sphere"), look.hijab, [0, 0.035, 0.035], [0.36, 0.41, 0.36]);
      put(head, shape("torus"), new THREE.Color(look.hijab).offsetHSL(0, 0, -0.06), [0, 0.0, -0.075], [0.33, 0.39, 0.3]);
    } else if (look.hairStyle === "ponytail") {
      put(head, shape("sphere"), hair, [0, 0.08, 0.02], [0.33, 0.27, 0.33]);
      put(head, capsule(0.05, 0.2), hair, [0, -0.05, 0.2], null, [-0.45, 0, 0]);
      put(head, shape("sphere"), look.accent || "#ff5d8f", [0, 0.07, 0.16], [0.07, 0.07, 0.05]); // the hair tie
    } else if (look.hairStyle === "braids") {
      put(head, shape("sphere"), hair, [0, 0.08, 0.02], [0.33, 0.27, 0.33]);
      put(head, shape("sphere"), hair, [0, 0.0, 0.07], [0.32, 0.28, 0.24]);
      [-1, 1].forEach((side) => {
        put(head, capsule(0.04, 0.2), hair, [side * 0.13, -0.17, 0.07], null, [0, 0, side * -0.12]);
        put(head, shape("sphere"), look.accent || "#ffd23f", [side * 0.145, -0.31, 0.07], [0.055, 0.055, 0.055]);
      });
    } else if (look.hairStyle === "short") {
      put(head, shape("sphere"), hair, [0, 0.08, 0.02], [0.33, 0.27, 0.33]);
    } else if (look.hairStyle === "curly") {
      for (let k = 0; k < 16; k++) { const a = (k / 16) * Math.PI * 2; put(head, shape("lowsphere"), hair, [Math.sin(a) * 0.13, 0.11 + (k % 3) * 0.02, Math.cos(a) * 0.13], [0.1, 0.1, 0.1]); }
      put(head, shape("sphere"), hair, [0, 0.15, 0.01], [0.27, 0.12, 0.27]);
    } else if (look.hairStyle === "swept") {
      put(head, shape("sphere"), hair, [0, 0.1, 0.03], [0.33, 0.25, 0.34]);
      put(head, shape("sphere"), hair, [-0.04, 0.16, -0.1], [0.22, 0.1, 0.16], [0.3, 0, 0.2]);
    } else if (look.hairStyle === "long") {
      put(head, shape("sphere"), hair, [0, 0.07, 0.03], [0.34, 0.3, 0.34]);
      put(head, shape("sphere"), hair, [0, -0.08, 0.08], [0.3, 0.3, 0.2]);
    } else {
      // Shakespeare: bald crown, brown curls from the temples down to the shoulders, round at the back
      const curls = [[-0.15, -0.02, 0.0], [0.15, -0.02, 0.0], [-0.16, -0.1, 0.04], [0.16, -0.1, 0.04], [-0.14, -0.18, 0.06], [0.14, -0.18, 0.06],
        [-0.11, 0.04, 0.09], [0.11, 0.04, 0.09], [-0.06, -0.02, 0.15], [0.06, -0.02, 0.15], [0, -0.08, 0.16], [-0.1, -0.12, 0.13], [0.1, -0.12, 0.13],
        [0, 0.03, 0.15], [-0.05, -0.17, 0.12], [0.05, -0.17, 0.12], [-0.17, -0.24, 0.02], [0.17, -0.24, 0.02]];
      curls.forEach((p, k) => put(head, shape("lowsphere"), k % 4 === 0 ? "#4e301b" : hair, p, [0.11 + (k % 3) * 0.015, 0.11, 0.1]));
    }
    if (kit === "shakespeare" && look.beard !== false) {
      put(head, shape("cone"), hair, [0, -0.205, -0.115], [0.07, 0.13, 0.06], [Math.PI - 0.25, 0, 0]); // pointed beard
      [-1, 1].forEach((side) => put(head, shape("sphere"), hair, [side * 0.035, -0.075, -0.158], [0.06, 0.022, 0.03], [0, 0, side * 0.35]));
    } else if (look.beard) {
      put(head, shape("sphere"), look.beard, [0, -0.1, -0.085], [0.26, 0.17, 0.2]);
    }
    if (kit === "shakespeare" || look.glasses) {
      [-1, 1].forEach((side) => {
        put(head, shape("torus"), "#141414", [side * 0.06, 0.035, -0.162], [0.09, 0.08, 0.06]);
        put(head, shape("box"), "#141414", [side * 0.135, 0.04, -0.09], [0.01, 0.012, 0.14]);
      });
      put(head, shape("box"), "#141414", [0, 0.04, -0.165], [0.04, 0.01, 0.01]);
    }
    if (kid) put(head, shape("smile"), "#9b3a2e", [0, -0.085, -0.153], [0.075, 0.05, 0.05], [-0.2, 0, 0]);
    else put(head, shape("box"), "#8a3b2c", [0, -0.1, -0.15], [0.05, 0.012, 0.01]);

    const m = vcMaterial(!!look.bent, { roughness: 0.62 });
    const cin = window.L1_3D && window.L1_3D.cinema;
    bins.forEach((list, j) => {
      const mesh = new THREE.Mesh(merge(list), m);
      mesh.castShadow = true;
      j.add(mesh);
      if (cin && look.ink !== false) j.add(cin.outlineOf(mesh, !!look.bent)); // a thin dark-brown ink line, like a drawn cartoon
    });
    if (look.number) { // the shirt number on the back (a kicker is usually seen from behind)
      const tex = textTexture(String(look.number), { w: 128, h: 128, color: look.numColor || "#ffffff", size: 96 });
      const num = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.2), new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.8 }));
      if (look.bent) bend(num.material);
      num.position.set(0, 0.27, 0.142);
      spine.add(num);
    }

    const fig = Object.assign({ root, look }, J);
    fig.reset = () => {
      ["hipL", "hipR", "kneeL", "kneeR", "ankleL", "ankleR", "shoulderL", "shoulderR", "elbowL", "elbowR", "wristL", "wristR", "spine", "neck", "head", "body", "pelvis"].forEach((k) => J[k].rotation.set(0, 0, 0));
      J.pelvis.position.y = 0.88;
      J.body.position.set(0, 0, 0);
    };
    fig.pose = (name, t, o) => setPose(fig, name, t || 0, o || {});
    return fig;
  }
  const shakespeare = (opts) => figure(Object.assign({ kit: "shakespeare" }, opts || {}));

  /* Poses. t is a running clock (seconds) for cyclic poses; o: { speed (steps per second), k (0..1 progress) } */
  function setPose(f, name, t, o) {
    f.reset();
    const s = Math.sin, c = Math.cos;
    const arm = (side, fwd, out, elbow) => { const sh = f["shoulder" + side], el = f["elbow" + side]; sh.rotation.x = fwd; sh.rotation.z = (side === "L" ? -1 : 1) * out; el.rotation.x = elbow; };
    const leg = (side, fwd, knee, out) => { f["hip" + side].rotation.x = fwd; f["knee" + side].rotation.x = -knee; f["hip" + side].rotation.z = (side === "L" ? -1 : 1) * (out || 0); };
    const k = o.k == null ? 0 : o.k;
    if (name === "run") {
      const p = t * (o.speed || 9);
      leg("L", s(p) * 0.85, 0.25 + 1.15 * Math.max(0, c(p)));
      leg("R", -s(p) * 0.85, 0.25 + 1.15 * Math.max(0, -c(p)));
      f.ankleL.rotation.x = 0.3 * Math.max(0, c(p)); f.ankleR.rotation.x = 0.3 * Math.max(0, -c(p));
      arm("L", -s(p) * 0.75, 0.12, 1.25);
      arm("R", s(p) * 0.75, 0.12, 1.25);
      f.pelvis.position.y = 0.86 + Math.abs(s(p)) * 0.06;
      f.spine.rotation.x = -0.2;
      f.spine.rotation.y = s(p) * 0.12;
      f.neck.rotation.x = 0.12;
      f.pelvis.rotation.y = -s(p) * 0.1;
    } else if (name === "jump") {
      // k: 0 take-off .. 1 landing; legs tuck in the middle
      const tuck = s(Math.min(1, Math.max(0, k)) * Math.PI);
      leg("L", 0.4 + tuck * 0.9, 0.3 + tuck * 1.5);
      leg("R", -0.2 + tuck * 0.6, 0.6 + tuck * 1.2);
      arm("L", 2.4 * tuck + 0.3, 0.35, 0.6);
      arm("R", 2.1 * tuck + 0.2, 0.35, 0.6);
      f.spine.rotation.x = -0.1 - tuck * 0.15;
    } else if (name === "slide") {
      // a baseball slide: low, legs forward, leaning back, one arm up for balance
      f.pelvis.position.y = 0.36;
      leg("L", 1.35, 0.15);
      leg("R", 1.15, 0.7);
      f.spine.rotation.x = 0.75;
      f.neck.rotation.x = -0.5;
      arm("L", -0.6, 0.5, 0.4);
      arm("R", 2.3, 0.3, 0.3);
    } else if (name === "stumble") {
      const w = s(t * 18);
      leg("L", 0.6, 0.8); leg("R", -0.5, 0.3);
      f.spine.rotation.x = -0.6;
      arm("L", 1.8 + w * 0.6, 0.8, 0.4); arm("R", 2.2 - w * 0.6, 0.8, 0.4);
      f.neck.rotation.x = 0.4;
    } else if (name === "fly") {
      leg("L", 0.5, 0.6, 0.5); leg("R", -0.6, 0.4, 0.5);
      arm("L", 2.6, 1.2, 0.3); arm("R", 2.9, 1.0, 0.2);
      f.spine.rotation.x = 0.3;
      f.neck.rotation.x = -0.3;
    } else if (name === "walk") {
      const p = t * (o.speed || 6);
      leg("L", s(p) * 0.45, 0.1 + 0.6 * Math.max(0, c(p)));
      leg("R", -s(p) * 0.45, 0.1 + 0.6 * Math.max(0, -c(p)));
      arm("L", -s(p) * 0.4, 0.08, 0.35); arm("R", s(p) * 0.4, 0.08, 0.35);
      f.pelvis.position.y = 0.88 + Math.abs(s(p)) * 0.025;
    } else if (name === "think") {
      arm("R", 1.2, 0.1, 2.3); arm("L", 0.1, 0.12, 0.2);
      f.neck.rotation.x = -0.1; f.head.rotation.z = 0.12 * s(t * 1.3);
      f.pelvis.position.y = 0.88 + s(t * 2) * 0.006;
    } else if (name === "cheer") {
      const b = Math.abs(s(t * 6));
      arm("L", 2.9, 0.4 + b * 0.2, 0.3); arm("R", 2.9, 0.4 + b * 0.2, 0.3);
      f.body.position.y = b * 0.12;
      leg("L", 0.1, 0.2 * b); leg("R", 0.1, 0.2 * b);
    } else if (name === "wave") {
      arm("R", 2.7, 0.5 + s(t * 7) * 0.25, 0.5); arm("L", 0.05, 0.1, 0.15);
      f.head.rotation.y = s(t * 0.9) * 0.2;
      f.pelvis.position.y = 0.88 + s(t * 2) * 0.006;
    } else if (name === "keeper") {
      // keeper ready: knees bent, arms out, bouncing on the toes
      const b = Math.abs(s(t * 5)) * 0.04;
      f.pelvis.position.y = 0.72 + b;
      leg("L", 0.45, 0.85, 0.25); leg("R", 0.45, 0.85, 0.25);
      f.spine.rotation.x = -0.35;
      arm("L", 0.9, 0.9, 0.6); arm("R", 0.9, 0.9, 0.6);
      f.neck.rotation.x = 0.35;
    } else if (name === "dive") {
      // dive to the keeper's left (o.dir = -1) or right (+1): the whole body leans over, arms stretched
      const d = o.dir || 1;
      f.body.rotation.z = -d * 1.25 * k;
      f.pelvis.position.y = 0.8;
      arm("L", 2.9, d < 0 ? 0.5 : 0.2, 0.1); arm("R", 2.9, d > 0 ? 0.5 : 0.2, 0.1);
      leg("L", 0.2, 0.3, 0.3); leg("R", -0.1, 0.5, 0.2);
    } else if (name === "kick") {
      // k: 0 wind-up .. 0.5 strike .. 1 follow-through (right foot)
      const w = k < 0.5 ? -1.2 * (k / 0.5) : -1.2 + 3.0 * Math.min(1, (k - 0.5) / 0.3);
      leg("R", w, k < 0.5 ? 1.2 * (k / 0.5) : 0.3);
      leg("L", 0.15, 0.25);
      arm("L", 0.9, 0.9, 0.4); arm("R", -0.5, 0.5, 0.4);
      f.spine.rotation.x = -0.2 + (k > 0.5 ? 0.25 : 0);
    } else if (name === "row") {
      const p = s(t * 3);
      arm("L", 1.2 + p * 0.5, 0.25, 0.5 - p * 0.3); arm("R", 1.2 + p * 0.5, 0.25, 0.5 - p * 0.3);
      f.spine.rotation.x = -0.15 - p * 0.15;
      f.pelvis.position.y = 0.5;
      leg("L", 1.5, 1.5); leg("R", 1.5, 1.5);
    } else if (name === "sad") {
      f.spine.rotation.x = -0.35; f.neck.rotation.x = 0.5;
      arm("L", 0.2, 0.05, 0.1); arm("R", 0.2, 0.05, 0.1);
    } else { // idle
      f.pelvis.position.y = 0.88 + s(t * 2) * 0.006;
      arm("L", 0.05 + s(t * 2) * 0.03, 0.1, 0.15); arm("R", 0.05 - s(t * 2) * 0.03, 0.1, 0.15);
      f.head.rotation.y = s(t * 0.7) * 0.15;
    }
  }
  // A figure in another kit (footballers): o = { shirt, shorts, socks, skin, hair, hairStyle, number, beard }
  const person = (o) => figure(Object.assign({ kit: "football", glasses: false }, o || {}));

  // ------------------------------------------------------------------ the heroes the student plays
  /* Six made-up children, boys and girls, picked on every game's start page (L1_Arcade keeps the choice).
     look = the everyday "kid" kit; team = the colours of their football kit in Penalti. */
  const HEROES = {
    aziz: { name: "Aziz", g: "m", team: "#2f6fed",
      look: { skin: "#e9bd8f", hair: "#17171c", hairStyle: "short", shirt: "#2f6fed", trousers: "#2a3448", shoe: "#f4f4f4", sole: "#ffd23f", accent: "#ffd23f" } },
    malika: { name: "Malika", g: "f", team: "#e2558e",
      look: { skin: "#f1c9a5", hair: "#17171c", hijab: "#f48fb8", shirt: "#8f6be0", tunic: "#8f6be0", trousers: "#2f2a4d", shoe: "#ffffff", sole: "#f48fb8", accent: "#ffe1ee" } },
    timur: { name: "Timur", g: "m", team: "#e5483b",
      look: { skin: "#f2c8a2", hair: "#6a4224", hairStyle: "swept", shirt: "#e5483b", trousers: "#3b4a5c", shoe: "#2b2b33", sole: "#ffffff", accent: "#ffffff" } },
    laylo: { name: "Laylo", g: "f", team: "#f2b01e",
      look: { skin: "#e9bd8f", hair: "#1d1512", hairStyle: "ponytail", shirt: "#f6b928", trousers: "#3c6fd1", shoe: "#ffffff", sole: "#ff5d8f", accent: "#ff5d8f" } },
    sardor: { name: "Sardor", g: "m", team: "#13a37f",
      look: { skin: "#d9a77c", hair: "#2a1c14", hairStyle: "curly", shirt: "#13a37f", trousers: "#2b2b33", shoe: "#ff7a3d", sole: "#ffffff", accent: "#ffd23f" } },
    nilufar: { name: "Nilufar", g: "f", team: "#ff7a3d",
      look: { skin: "#f3cfae", hair: "#3b2416", hairStyle: "braids", shirt: "#ff7a3d", tunic: "#ff7a3d", trousers: "#6c3fb0", shoe: "#ffffff", sole: "#6c3fb0", accent: "#ffd23f" } },
  };
  const heroId = (id) => (HEROES[id] ? id : "aziz");
  const hero = (id, extra) => figure(Object.assign({ kit: "kid" }, HEROES[heroId(id)].look, extra || {}));
  /* The same child in a football kit (Penalti): own face and hair, the team colour; a hijab keeps arms and legs covered. */
  function heroKit(id, extra) {
    const h = HEROES[heroId(id)], l = h.look;
    return Object.assign({
      kit: "football", glasses: false, skin: l.skin, hair: l.hair, hairStyle: l.hairStyle, hijab: l.hijab, accent: l.accent,
      shirt: h.team, shorts: h.team, socks: "#f4f4f4",
      longSleeves: !!l.hijab, leggings: l.hijab ? l.trousers : null,
    }, extra || {});
  }

  /* A still picture of a hero (transparent background) for the 2D pages: start, pause and results cards, the hero
     picker. pose: a figure pose; px: CSS height; bust: head and shoulders only. Drawn once by one shared renderer and
     kept as a data URL. */
  let snap = null;
  const snaps = {};
  function portrait(id, pose, px, bust) {
    const k = [heroId(id), pose, px, bust ? 1 : 0].join("|");
    if (snaps[k]) return snaps[k];
    const THREE = T();
    if (!snap) {
      const r = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
      r.outputColorSpace = THREE.SRGBColorSpace;
      r.toneMapping = THREE.ACESFilmicToneMapping;
      r.toneMappingExposure = 1.08;
      r.setClearColor(0x000000, 0);
      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(r);
      scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
      scene.environmentIntensity = 0.6;
      pmrem.dispose();
      scene.add(new THREE.HemisphereLight(0xfff6e8, 0x8a7a66, 1.1));
      const key = new THREE.DirectionalLight(0xffffff, 2.1);
      key.position.set(-2, 4, 5);
      scene.add(key);
      snap = { r, scene, camera: new THREE.PerspectiveCamera(24, 1, 0.1, 50) };
    }
    const f = hero(id);
    f.pose(pose || "idle", 0.35, { k: 0.5 });
    f.root.rotation.y = Math.PI + 0.32; // a three-quarter view of the face
    snap.scene.add(f.root);
    f.root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(f.root);
    const head = new THREE.Vector3();
    f.head.getWorldPosition(head);
    const top = box.max.y + 0.04, bottom = bust ? head.y - 0.62 : box.min.y - 0.02;
    const hgt = top - bottom, wid = bust ? hgt : Math.max(box.max.x - box.min.x, box.max.z - box.min.z) + 0.25;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.round((px * wid) / hgt * dpr), h = Math.round(px * dpr);
    snap.r.setSize(w, h, false);
    const cam = snap.camera;
    cam.aspect = w / h;
    const dist = hgt / 2 / Math.tan((cam.fov * Math.PI) / 360);
    const cx = bust ? head.x : (box.max.x + box.min.x) / 2;
    cam.position.set(cx, bottom + hgt / 2, dist + 0.4);
    cam.lookAt(cx, bottom + hgt / 2, 0);
    cam.updateProjectionMatrix();
    snap.r.render(snap.scene, cam);
    snaps[k] = { url: snap.r.domElement.toDataURL("image/png"), w: w / dpr, h: h / dpr };
    snap.scene.remove(f.root);
    f.root.traverse((ob) => { if (ob.geometry && !ob.geometry.userData.shared) ob.geometry.dispose(); });
    return snaps[k];
  }

  // ------------------------------------------------------------------ picture tokens (Word Ninja targets, River items)
  /* A word's picture on a light round face, as a texture: drawable = an image or a canvas (L1_Arcade.picDrawable). */
  function tokenTexture(drawable, ring) {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d");
    const grd = g.createRadialGradient(110, 96, 10, 128, 128, 128);
    grd.addColorStop(0, "#ffffff"); grd.addColorStop(0.7, "#fff6e6"); grd.addColorStop(1, "#f3dcb8");
    g.fillStyle = grd; g.beginPath(); g.arc(128, 128, 127, 0, Math.PI * 2); g.fill();
    g.lineWidth = 10; g.strokeStyle = ring || "#ffb547"; g.beginPath(); g.arc(128, 128, 120, 0, Math.PI * 2); g.stroke();
    if (drawable) {
      const w = drawable.naturalWidth || drawable.width, h = drawable.naturalHeight || drawable.height;
      const s = 176 / Math.max(w, h);
      g.drawImage(drawable, 128 - (w * s) / 2, 128 - (h * s) / 2, w * s, h * s);
    }
    return pictureTexture(c);
  }
  /* A thick round token facing +z: o { radius, depth, rim (colour), tex }. Returns { root, faceMat, rimMat }.
     theta: a half token (thetaStart, Math.PI) with its own half of the picture, for cutting. */
  function token(o, theta) {
    const THREE = T();
    const r = o.radius || 0.6, d = o.depth || 0.18;
    const root = new THREE.Group();
    const faceMat = o.faceMat || new THREE.MeshStandardMaterial({ map: o.tex, roughness: 0.45 });
    const rimMat = o.rimMat || new THREE.MeshStandardMaterial({ color: o.rim || "#ffb547", roughness: 0.35, metalness: 0.15 });
    const t0 = theta == null ? 0 : theta, tl = theta == null ? Math.PI * 2 : Math.PI;
    const front = new THREE.Mesh(new THREE.CircleGeometry(r, 40, t0, tl), faceMat);
    front.position.z = d / 2;
    const back = new THREE.Mesh(new THREE.CircleGeometry(r, 40, -t0, tl), rimMat); // turned round below, so mirrored here
    back.position.z = -d / 2; back.rotation.y = Math.PI;
    const rimG = new THREE.CylinderGeometry(r, r, d, 40, 1, true, t0, tl);
    rimG.rotateX(Math.PI / 2);
    const rim = new THREE.Mesh(rimG, rimMat);
    root.add(front, back, rim);
    if (theta != null) { // the flat cut face along the diameter
      const cut = new THREE.Mesh(new THREE.PlaneGeometry(2 * r, d), new THREE.MeshStandardMaterial({ color: o.cut || "#fff1d6", roughness: 0.8 }));
      cut.rotation.set(Math.PI / 2, 0, t0, "ZYX"); // stand it up along z first, then turn it to the cut line
      root.add(cut);
    }
    root.traverse((m) => { if (m.isMesh) m.castShadow = true; });
    return { root, faceMat, rimMat };
  }
  // A cartoon glove (white, four fingers, orange cuff) pointing at -x; for the gentle tap on living things.
  function glove() {
    const THREE = T();
    const parts = [];
    parts.push(part(shape("rbox"), "#ffffff", [0, 0, 0], null, [0.32, 0.36, 0.16]));
    for (let k = 0; k < 4; k++) parts.push(part(new THREE.CapsuleGeometry(0.045, 0.16, 4, 8), "#ffffff", [-0.22, 0.12 - k * 0.08, 0], [0, 0, Math.PI / 2], null));
    parts.push(part(new THREE.CapsuleGeometry(0.05, 0.12, 4, 8), "#ffffff", [-0.05, 0.22, 0.02], [0, 0, -0.5], null));
    parts.push(part(shape("cyl"), "#ff8a3d", [0.2, 0, 0], [0, 0, Math.PI / 2], [0.38, 0.12, 0.26]));
    const m = new THREE.Mesh(merge(parts), vcMaterial(false, { roughness: 0.5 }));
    m.castShadow = true;
    return m;
  }

  window.L1_3D = { supported, stage, sky, curve, bend, part, merge, shape, vcMaterial, mat, textTexture, pictureTexture, Sparks, shakespeare, person, figure, tokenTexture, token, glove,
    HEROES, hero, heroKit, portrait };
})(window);
