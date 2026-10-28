/* arcade_cinema.js (window.L1_3D.cinema): the look of an animated movie, shared by the four arcade games.
 *
 * - mood(): a painted sky with a big sun and halo, layers of silhouette hills with acacia trees in aerial perspective,
 *   warm key light + cool fill + a rim light from behind, fog in the horizon colour. setTime(k) walks the whole picture from
 *   afternoon (0) to sunset (1), so a journey can end at golden hour.
 * - motes(): dust and pollen drifting in the light. birds(): a flock crossing the sky.
 * - grade(): the vignette and warm grading laid over the canvas (plain CSS, no filter).
 * - toonMaterial(): a soft cel-shaded material (four warm steps, the shadow side stays coloured, never black); arcade3d.js
 *   uses it for every shared material.
 * - outlineOf(): a thin dark-brown ink line round a mesh (an inverted hull), for people and for things the student acts on.
 * Needs arcade3d.js (L1_3D) and window.THREE.
 */
(function (window) {
  "use strict";
  const D = window.L1_3D;
  if (!D) return;
  const T = () => window.THREE;

  // ------------------------------------------------------------------ cel shading and ink
  let ramp = null;
  function toonRamp() {
    if (ramp) return ramp;
    const THREE = T(), v = [118, 186, 232, 255];
    const data = new Uint8Array(v.length * 4);
    v.forEach((x, i) => { data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = x; data[i * 4 + 3] = 255; });
    ramp = new THREE.DataTexture(data, v.length, 1, THREE.RGBAFormat);
    ramp.minFilter = ramp.magFilter = THREE.NearestFilter;
    ramp.generateMipmaps = false;
    ramp.needsUpdate = true;
    ramp.userData.shared = true;
    return ramp;
  }
  function toonMaterial(opts) {
    const o = Object.assign({}, opts || {});
    ["roughness", "metalness", "envMapIntensity"].forEach((k) => delete o[k]);
    return new (T().MeshToonMaterial)(Object.assign({ gradientMap: toonRamp() }, o));
  }

  const ink = {};
  function outlineMaterial(bent) {
    const k = bent ? "b" : "f";
    if (ink[k]) return ink[k];
    const m = new (T().MeshBasicMaterial)({ color: "#2a1608", side: T().BackSide });
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uInk = { value: 0.009 };
      let vs = "uniform float uInk;\n" + (bent ? "uniform float uCurve;\n" : "") +
        shader.vertexShader.replace("#include <begin_vertex>", "vec3 transformed = position + normalize(normal) * uInk;");
      if (bent) {
        shader.uniforms.uCurve = D.curve;
        vs = vs.replace("#include <project_vertex>", "#include <project_vertex>\n  mvPosition.y -= uCurve * mvPosition.z * mvPosition.z;\n  gl_Position = projectionMatrix * mvPosition;");
      }
      shader.vertexShader = vs;
    };
    m.customProgramCacheKey = () => "l1ink" + k;
    m.userData.shared = true;
    ink[k] = m;
    return m;
  }
  /* An ink line for a mesh: a second mesh with the same geometry, drawn from inside. Add it to the mesh's parent. */
  function outlineOf(mesh, bent) {
    const o = new (T().Mesh)(mesh.geometry, outlineMaterial(!!bent));
    o.position.copy(mesh.position); o.quaternion.copy(mesh.quaternion); o.scale.copy(mesh.scale);
    o.userData.ink = true;
    return o;
  }
  // every mesh of a group gets its ink line (a flat picture, a sprite or a transparent thing is left alone)
  function outline(root, bent) {
    const list = [];
    root.traverse((m) => { if (m.isMesh && !m.userData.ink && !m.userData.noInk && m.geometry.attributes.normal && !(m.material && m.material.transparent)) list.push(m); });
    list.forEach((m) => { if (m.parent) m.parent.add(outlineOf(m, bent)); });
    return root;
  }

  // ------------------------------------------------------------------ palettes
  // Every palette has the same keys, so setTime can walk from one to another. Colours are hex strings.
  const PALETTES = {
    afternoon: { top: "#3f95ee", mid: "#8ec6ff", horizon: "#ffe6b8", sunCol: "#fffbe6", glow: "#ffd9a0", glowK: 0.4, sun: [0.2, 0.3, -1],
      hemiSky: "#cfe6ff", hemiGround: "#e9cf9a", hemiI: 1.1, key: "#fff0d0", keyI: 2.5, rim: "#ffd7a6", rimI: 0.9, fog: "#f6dcb4",
      hills: ["#d9b394", "#c39578", "#a97565"], ground: "#c2b074" },
    sunset: { top: "#4a4fb8", mid: "#e8755c", horizon: "#ffb560", sunCol: "#fff2c4", glow: "#ff8f3d", glowK: 0.95, sun: [0.12, 0.085, -1],
      hemiSky: "#a99be6", hemiGround: "#ff9a5c", hemiI: 1.0, key: "#ffb765", keyI: 2.6, rim: "#ff5f93", rimI: 1.5, fog: "#f59a62",
      hills: ["#e8845f", "#b9515b", "#6f3759"], ground: "#9a5648" },
    dusk: { top: "#251a5e", mid: "#8e3f86", horizon: "#ff8a57", sunCol: "#ffe0a8", glow: "#ff6b6b", glowK: 0.8, sun: [0.1, 0.05, -1],
      hemiSky: "#6c5cc4", hemiGround: "#e0707a", hemiI: 0.95, key: "#ffb27a", keyI: 2.1, rim: "#ff63a5", rimI: 1.3, fog: "#9c4a7e",
      hills: ["#9b4a82", "#6c3a76", "#3d2a5e"], ground: "#4a2f5c" },
    morning: { top: "#5aa8f0", mid: "#ffc9a0", horizon: "#ffe3a8", sunCol: "#fffbe0", glow: "#ffcf86", glowK: 0.8, sun: [-0.3, 0.2, -1],
      hemiSky: "#d6ecff", hemiGround: "#f2d8a0", hemiI: 1.1, key: "#ffe2b0", keyI: 2.4, rim: "#ffc08a", rimI: 1.0, fog: "#fbd9ae",
      hills: ["#e9bf9a", "#cf9a82", "#a87368"], ground: "#cdb67e" },
  };
  const col = (h) => new (T().Color)(h);

  // ------------------------------------------------------------------ the sky
  function skyMesh(scene, radius) {
    const THREE = T();
    const mat = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: {
        top: { value: col("#3f95ee") }, mid: { value: col("#8ec6ff") }, bottom: { value: col("#ffe6b8") },
        sunDir: { value: new THREE.Vector3(0, 0.3, -1).normalize() }, sunCol: { value: col("#fffbe6") }, glow: { value: col("#ffd9a0") }, glowK: { value: 0.5 },
      },
      vertexShader: "varying vec3 vd; void main(){ vd = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: [
        "uniform vec3 top; uniform vec3 mid; uniform vec3 bottom; uniform vec3 sunDir; uniform vec3 sunCol; uniform vec3 glow; uniform float glowK; varying vec3 vd;",
        "void main(){",
        "  vec3 d = normalize(vd); float h = d.y;",
        "  vec3 c = mix(bottom, mid, smoothstep(-0.04, 0.2, h));",
        "  c = mix(c, top, smoothstep(0.14, 0.75, h));",
        "  float s = max(dot(d, sunDir), 0.0);",
        "  c += glow * (pow(s, 5.0) * 0.5 + pow(s, 28.0) * 0.7) * glowK;",
        "  c = mix(c, sunCol, smoothstep(0.9915, 0.9932, s));",
        "  gl_FragColor = vec4(c, 1.0);",
        "  #include <colorspace_fragment>",
        "}",
      ].join("\n"),
    });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius || 300, 32, 16), mat);
    mesh.renderOrder = -10;
    mesh.frustumCulled = false;
    scene.add(mesh);
    return mesh;
  }

  // ------------------------------------------------------------------ hills and acacias
  // Rings of silhouette ridges round the camera, the far ones pale and hazy, the near ones dark: aerial perspective.
  function hillsRing(scene, dir) {
    const THREE = T();
    const group = new THREE.Group();
    const specs = [{ r: 236, h: 30, seed: 1.3 }, { r: 222, h: 24, seed: 4.1 }, { r: 208, h: 17, seed: 7.7 }];
    const layers = specs.map((L, li) => {
      const seg = 120, pos = [], idx = [];
      for (let k = 0; k <= seg; k++) {
        const a = (k / seg) * Math.PI * 2;
        const bump = 0.55 + 0.28 * Math.sin(a * 3 + L.seed) + 0.2 * Math.sin(a * 7 + L.seed * 2) + 0.1 * Math.sin(a * 13 + L.seed * 3);
        // a gap in the hills where the sun sits, so the horizon opens up there
        const da = Math.abs(((a - dir + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
        const open = 0.55 + 0.45 * Math.min(1, da / 0.6);
        const x = Math.cos(a) * L.r, z = Math.sin(a) * L.r;
        pos.push(x, -6, z, x, Math.max(1.5, L.h * bump * open), z);
        if (k < seg) { const b = k * 2; idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2); }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      geo.setIndex(idx);
      const mat = new THREE.MeshBasicMaterial({ color: "#cc9977", side: THREE.DoubleSide, fog: false, depthWrite: false });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.renderOrder = -9 + li;
      mesh.frustumCulled = false;
      group.add(mesh);
      return { mesh, mat, spec: L };
    });
    // acacias (flat-topped, like the ones against an African sunset) standing on the nearest ridge, as one dark mesh
    const parts = [];
    const L3 = specs[2];
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2 + Math.sin(i * 12.9) * 0.05;
      const da = Math.abs(((a - dir + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      if (da < 0.22) continue;
      const bump = 0.55 + 0.28 * Math.sin(a * 3 + L3.seed) + 0.2 * Math.sin(a * 7 + L3.seed * 2) + 0.1 * Math.sin(a * 13 + L3.seed * 3);
      const open = 0.55 + 0.45 * Math.min(1, da / 0.6);
      const y = Math.max(1.5, L3.h * bump * open) - 0.4, r = L3.r - 1.5;
      const s = 2.4 + ((i * 7) % 5) * 0.5, x = Math.cos(a) * r, z = Math.sin(a) * r;
      parts.push(D.part(D.shape("cyl"), "#ffffff", [x, y + s * 0.8, z], [0, 0, (i % 3 - 1) * 0.12], [0.3, s * 1.6, 0.3]));
      parts.push(D.part(D.shape("sphere"), "#ffffff", [x, y + s * 1.7, z], [0, -a, 0], [s * 3.6, s * 0.7, s * 2.4]));
    }
    let trees = null;
    if (parts.length) {
      const mat = new THREE.MeshBasicMaterial({ vertexColors: true, fog: false, depthWrite: false });
      trees = { mesh: new THREE.Mesh(D.merge(parts), mat), mat };
      trees.mesh.renderOrder = -6;
      trees.mesh.frustumCulled = false;
      group.add(trees.mesh);
    }
    scene.add(group);
    return { group, layers, trees };
  }

  // ------------------------------------------------------------------ motes and birds
  let dotTex = null;
  function dot() {
    if (dotTex) return dotTex;
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d"), grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(255,255,255,1)"); grd.addColorStop(0.4, "rgba(255,255,255,.55)"); grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    dotTex = D.pictureTexture(c);
    dotTex.userData.shared = true;
    return dotTex;
  }
  function motes(scene, n, o) {
    const THREE = T();
    o = o || {};
    n = n || 80;
    const size = o.size || [26, 9, 34];
    const pos = new Float32Array(n * 3), seed = [];
    for (let i = 0; i < n; i++) { seed.push({ x: Math.random(), y: Math.random(), z: Math.random(), s: 0.15 + Math.random() * 0.5, p: Math.random() * 6.28 }); }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ size: o.pointSize || 0.12, map: dot(), color: o.color || "#ffe2a0", transparent: true, opacity: o.opacity || 0.7, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    scene.add(pts);
    let t = 0;
    return {
      points: pts, mat,
      // centre: where the box of dust is (the camera, a little ahead); drift: how fast the world slides past (m/s)
      update(dt, cx, cy, cz, drift) {
        t += dt;
        const dz = (drift || 0) * dt;
        for (let i = 0; i < n; i++) {
          const s = seed[i];
          s.z = (s.z + (dz / size[2]) + dt * 0.01 * s.s + 2) % 1;
          if (o.fall) s.y = (s.y - (o.fall * dt) / size[1] + 2) % 1; // petals and leaves come down
          pos[i * 3] = cx + (s.x - 0.5) * size[0] + Math.sin(t * s.s + s.p) * 0.5;
          pos[i * 3 + 1] = cy + (s.y - 0.35) * size[1] + Math.sin(t * 0.6 * s.s + s.p) * 0.35;
          pos[i * 3 + 2] = cz - 2 - s.z * size[2];
        }
        geo.attributes.position.needsUpdate = true;
      },
    };
  }
  function birds(scene, n, o) {
    const THREE = T();
    o = o || {};
    n = n || 7;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, 1.7, 0, -0.55, 0.15, 0, 0.5], 3));
    geo.computeVertexNormals();
    const mat = new THREE.MeshBasicMaterial({ color: o.color || "#3a1c2c", side: THREE.DoubleSide, fog: false });
    const dir = o.dir == null ? -Math.PI / 2 : o.dir, spread = o.spread || 1.15;
    const grp = new THREE.Group(), flock = [];
    for (let i = 0; i < n; i++) {
      const b = new THREE.Group(), L = new THREE.Mesh(geo, mat), R = new THREE.Mesh(geo, mat);
      R.scale.x = -1;
      b.add(L, R);
      b.scale.setScalar(1.3 + Math.random() * 1.1);
      b.userData = { L, R, k: Math.random(), r: 100 + Math.random() * 60, y: 34 + Math.random() * 34, sp: 0.012 + Math.random() * 0.012, ph: Math.random() * 6.28 };
      grp.add(b); flock.push(b);
    }
    scene.add(grp);
    let t = 0;
    return {
      group: grp, mat,
      update(dt, cx, cz) {
        t += dt;
        grp.position.set(cx, 0, cz);
        for (const b of flock) {
          const u = b.userData;
          u.k = (u.k + u.sp * dt * 6) % 1;
          const a = dir + (u.k - 0.5) * 2 * spread;
          b.position.set(Math.cos(a) * u.r, u.y + Math.sin(t * 0.7 + u.ph) * 2, Math.sin(a) * u.r);
          b.rotation.y = -a;
          const f = Math.sin(t * 5.5 + u.ph) * 0.55;
          u.L.rotation.z = f; u.R.rotation.z = -f;
        }
      },
    };
  }

  // ------------------------------------------------------------------ the grade over the canvas
  function grade(host, o) {
    o = o || {};
    const el = document.createElement("div");
    el.className = "ac-grade" + (o.night ? " is-night" : "");
    el.setAttribute("aria-hidden", "true");
    host.appendChild(el);
    return el;
  }

  // ------------------------------------------------------------------ the whole mood
  /* st: a stage (L1_3D.stage). o: { from: palette name or object, to: palette name or object, dir (angle of the sun round
     the camera, default straight ahead), hills: true, motes: true, birds: true, sky radius, fog [near, far] }
     Returns { key, rim, hemi, setTime(k), update(dt, camera, drift), sky, dispose }. */
  function mood(st, o) {
    const THREE = T();
    o = o || {};
    const A = typeof o.from === "string" ? PALETTES[o.from] : o.from || PALETTES.afternoon;
    const B = typeof o.to === "string" ? PALETTES[o.to] : o.to || A;
    const scene = st.scene;
    const dir = o.dir == null ? -Math.PI / 2 : o.dir;
    const sky = skyMesh(scene, o.radius || 280);
    const hills = o.hills === false ? null : hillsRing(scene, dir);
    let ground = null; // a far plain under the horizon (for scenes whose own floor is small), fading into the haze
    if (o.ground) {
      const gg = new THREE.CircleGeometry(290, 48);
      gg.rotateX(-Math.PI / 2);
      ground = new THREE.Mesh(gg, new THREE.MeshBasicMaterial({ color: "#c2b074", depthWrite: false }));
      ground.position.y = o.ground.y == null ? -10 : o.ground.y;
      ground.renderOrder = -9.5;
      ground.frustumCulled = false;
      scene.add(ground);
    }
    const hemi = new THREE.HemisphereLight("#ffffff", "#ffffff", 1);
    const key = new THREE.DirectionalLight("#ffffff", 1);
    const rim = new THREE.DirectionalLight("#ffffff", 0.5);
    scene.add(hemi, key, rim, key.target);
    scene.fog = new THREE.Fog("#ffffff", (o.fog || [34, 125])[0], (o.fog || [34, 125])[1]);
    const mo = o.motes === false ? null : motes(scene, o.moteCount || 70, o.moteOpts);
    const bi = o.birds === false ? null : birds(scene, o.birdCount || 7, { dir, spread: o.birdSpread });
    const u = sky.material.uniforms;
    const c = new THREE.Color(), c2 = new THREE.Color(), v = new THREE.Vector3();
    const mix = (k, key2, t) => c.set(A[key2]).lerp(c2.set(B[key2]), t);
    const num = (key2, t) => A[key2] + (B[key2] - A[key2]) * t;
    // the sun's screen side: A.sun is [x, y, z] (z negative = ahead); the angle is turned with dir
    const sunVec = (t) => {
      const a = A.sun, b = B.sun;
      v.set(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t).normalize();
      const turn = dir + Math.PI / 2; // rotate about y so "ahead" follows dir
      const x = v.x * Math.cos(turn) - v.z * Math.sin(turn), z = v.x * Math.sin(turn) + v.z * Math.cos(turn);
      return v.set(x, v.y, z);
    };
    const api = {
      key, rim, hemi, sky, hills, motes: mo, birds: bi, time: 0,
      setTime(t) {
        t = Math.max(0, Math.min(1, t));
        api.time = t;
        u.top.value.copy(mix(0, "top", t)); u.mid.value.copy(mix(0, "mid", t)); u.bottom.value.copy(mix(0, "horizon", t));
        u.sunCol.value.copy(mix(0, "sunCol", t)); u.glow.value.copy(mix(0, "glow", t)); u.glowK.value = num("glowK", t);
        u.sunDir.value.copy(sunVec(t));
        hemi.color.copy(mix(0, "hemiSky", t)); hemi.groundColor.copy(mix(0, "hemiGround", t)); hemi.intensity = num("hemiI", t);
        key.color.copy(mix(0, "key", t)); key.intensity = num("keyI", t);
        rim.color.copy(mix(0, "rim", t)); rim.intensity = num("rimI", t);
        scene.fog.color.copy(mix(0, "fog", t));
        // the light comes from the sun's side; the rim light from the opposite, low side
        api.lightDir = u.sunDir.value.clone();
        rim.position.set(-u.sunDir.value.x * 12, 6, -u.sunDir.value.z * 12);
        if (hills) {
          hills.layers.forEach((L, i) => L.mat.color.copy(c.set(A.hills[i]).lerp(c2.set(B.hills[i]), t)));
          if (hills.trees) hills.trees.mat.color.copy(c.set(A.hills[2]).lerp(c2.set(B.hills[2]), t)).multiplyScalar(0.55);
        }
        if (ground) ground.material.color.copy(mix(0, "ground", t));
        if (bi) bi.mat.color.copy(c.set(A.hills[2]).lerp(c2.set(B.hills[2]), t)).multiplyScalar(0.5);
        if (mo) mo.mat.color.copy(mix(0, "glow", t)).lerp(c2.set("#ffffff"), 0.35);
      },
      // keep the sky, hills and birds centred on the camera; drift = how fast the world slides past (m/s)
      update(dt, camera, drift) {
        const p = camera.position;
        sky.position.copy(p);
        if (hills) hills.group.position.set(p.x, 0, p.z);
        if (ground) ground.position.set(p.x, ground.position.y, p.z);
        if (bi) bi.update(dt, p.x, p.z);
        if (mo) mo.update(dt, p.x, p.y, p.z, drift);
      },
      dispose() { /* the stage disposes everything in its scene */ },
    };
    api.setTime(0);
    return api;
  }

  D.cinema = { PALETTES, mood, motes, birds, grade, toonMaterial, toonRamp, outline, outlineOf, skyMesh, hillsRing };
})(window);
