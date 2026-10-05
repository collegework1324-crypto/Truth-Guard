import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const TruthGuardCore3D = ({ height = '520px', interactive = true }) => {
  const mountRef = useRef(null);
  const [activeNode, setActiveNode] = useState(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // WebGL support check
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    };

    if (!checkWebGL()) {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth || 600;
    const containerHeight = container.clientHeight || 520;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040711, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / containerHeight, 0.1, 1000);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, containerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x040711, 0);
    
    // Clear any previous canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f2fe, 4, 30);
    cyanLight.position.set(0, 0, 2);
    scene.add(cyanLight);

    const blueLight = new THREE.PointLight(0x4facfe, 3, 25);
    blueLight.position.set(-6, 4, 4);
    scene.add(blueLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 2.5, 25);
    purpleLight.position.set(6, -4, -2);
    scene.add(purpleLight);

    // Core Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Inner Shield / Core Geometry
    const innerGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0x00f2fe,
      emissive: 0x005577,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
      shininess: 100
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // 2. Outer Wireframe Sphere
    const outerGeo = new THREE.IcosahedronGeometry(2.4, 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x4facfe,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerMesh);

    // 3. Glowing Center Nucleus
    const nucleusGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const nucleusMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.9
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    coreGroup.add(nucleusMesh);

    // 4. Orbital Rings
    const createRing = (radius, color, rotX, rotY) => {
      const ringGeo = new THREE.RingGeometry(radius, radius + 0.04, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = rotX;
      ringMesh.rotation.y = rotY;
      return ringMesh;
    };

    const ring1 = createRing(4.2, 0x00f2fe, Math.PI / 3, Math.PI / 6);
    const ring2 = createRing(5.4, 0x6366f1, -Math.PI / 4, Math.PI / 3);
    scene.add(ring1);
    scene.add(ring2);

    // 5. Orbiting Modality Nodes
    const nodeDefs = [
      { id: 'text', label: 'NLP TEXT NODE', color: 0x00f2fe, angle: 0, distance: 4.8, description: 'Supervised TF-IDF & Logistic Regression NLP classifier' },
      { id: 'image', label: 'VISION NODE', color: 0x4facfe, angle: Math.PI / 2, distance: 4.8, description: 'CLIP ViT-B/32 image-text cosine similarity' },
      { id: 'fusion', label: 'FUSION GATE', color: 0xa855f7, angle: Math.PI, distance: 4.8, description: 'Reliability-Gated sigmoid modality fusion engine' },
      { id: 'evidence', label: 'EVIDENCE NODE', color: 0x10b981, angle: (Math.PI * 3) / 2, distance: 4.8, description: 'Explainable verdict synthesis & evidence logging' }
    ];

    const nodeMeshes = [];

    nodeDefs.forEach((def) => {
      const nodeGroup = new THREE.Group();
      
      // Node sphere
      const sphereGeo = new THREE.SphereGeometry(0.42, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: def.color,
        emissive: def.color,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      nodeGroup.add(sphereMesh);

      // Node glow ring
      const ringGeo = new THREE.RingGeometry(0.52, 0.58, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: def.color, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
      const nodeRing = new THREE.Mesh(ringGeo, ringMat);
      nodeRing.rotation.x = Math.PI / 2;
      nodeGroup.add(nodeRing);

      // Initial position
      nodeGroup.position.x = Math.cos(def.angle) * def.distance;
      nodeGroup.position.z = Math.sin(def.angle) * def.distance;

      scene.add(nodeGroup);
      nodeMeshes.push({ group: nodeGroup, def, angle: def.angle, radius: def.distance });

      // Connecting beam line to central core
      const lineMat = new THREE.LineDashedMaterial({
        color: def.color,
        dashSize: 0.2,
        gapSize: 0.1,
        transparent: true,
        opacity: 0.4
      });
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        nodeGroup.position
      ]);
      const line = new THREE.Line(lineGeo, lineMat);
      line.computeLineDistances();
      scene.add(line);
      def.line = line;
    });

    // 6. Particle Cloud
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0x00f2fe);
    const c2 = new THREE.Color(0xa855f7);

    for (let i = 0; i < particleCount; i++) {
      const radius = 3 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const mix = Math.random();
      const pColor = c1.clone().lerp(c2, mix);
      colors[i * 3] = pColor.r;
      colors[i * 3 + 1] = pColor.g;
      colors[i * 3 + 2] = pColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX = (x / rect.width) * 2 - 1;
      mouseY = -(y / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      targetX = mouseX * 0.8;
      targetY = mouseY * 0.5;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Core rotation
      innerMesh.rotation.y = elapsedTime * 0.3;
      innerMesh.rotation.x = elapsedTime * 0.15;
      outerMesh.rotation.y = -elapsedTime * 0.2;
      outerMesh.rotation.z = elapsedTime * 0.1;

      // Nucleus pulse
      const pulse = 1 + Math.sin(elapsedTime * 3) * 0.08;
      nucleusMesh.scale.set(pulse, pulse, pulse);

      // Ring rotation
      ring1.rotation.z = elapsedTime * 0.12;
      ring2.rotation.z = -elapsedTime * 0.16;

      // Orbiting nodes
      nodeMeshes.forEach((item) => {
        item.angle += 0.008;
        const x = Math.cos(item.angle) * item.radius;
        const z = Math.sin(item.angle) * item.radius;
        const y = Math.sin(elapsedTime * 2 + item.angle) * 0.4;
        
        item.group.position.set(x, y, z);
        item.group.rotation.y += 0.02;

        // Update beam lines
        if (item.def.line) {
          const positions = item.def.line.geometry.attributes.position.array;
          positions[3] = x;
          positions[4] = y;
          positions[5] = z;
          item.def.line.geometry.attributes.position.needsUpdate = true;
        }
      });

      // Particles rotation
      particles.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [interactive]);

  return (
    <div style={{ position: 'relative', width: '100%', height: height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {webglSupported ? (
        <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      ) : (
        /* Graceful 2D Fallback if WebGL unavailable */
        <div style={{
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          border: '2px solid rgba(0, 242, 254, 0.4)',
          background: 'radial-gradient(circle, rgba(0, 242, 254, 0.2) 0%, rgba(4, 7, 17, 0.9) 70%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 40px rgba(0, 242, 254, 0.3)',
          textAlign: 'center',
          padding: '20px'
        }} className="animate-pulse-glow">
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🛡️</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-cyan)' }} className="heading-serif">
            TRUTH GUARD CORE
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Multimodal NLP & CLIP Vision Analysis Engine
          </div>
        </div>
      )}

      {/* Floating 3D Node Tooltip Badges */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '12px',
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        <div className="badge-info" style={{ backdropFilter: 'blur(10px)', fontSize: '0.76rem', border: '1px solid rgba(0, 242, 254, 0.3)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f2fe', display: 'inline-block', marginRight: '6px' }} />
          TEXT NLP (TF-IDF + LR)
        </div>
        <div className="badge-info" style={{ backdropFilter: 'blur(10px)', fontSize: '0.76rem', border: '1px solid rgba(79, 172, 254, 0.3)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4facfe', display: 'inline-block', marginRight: '6px' }} />
          VISION (CLIP Alignment)
        </div>
        <div className="badge-info" style={{ backdropFilter: 'blur(10px)', fontSize: '0.76rem', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7', display: 'inline-block', marginRight: '6px' }} />
          GATED FUSION (Sigmoid α)
        </div>
        <div className="badge-info" style={{ backdropFilter: 'blur(10px)', fontSize: '0.76rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', marginRight: '6px' }} />
          EVIDENCE (Explainable)
        </div>
      </div>
    </div>
  );
};
