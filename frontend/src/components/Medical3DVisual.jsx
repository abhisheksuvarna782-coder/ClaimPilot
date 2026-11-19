import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Dna, Activity, Cpu } from 'lucide-react';

export default function Medical3DVisual({ className = '' }) {
  const containerRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [activeMode, setActiveMode] = useState('spine'); // 'spine' | 'dna' | 'cardiac'
  const modeRef = useRef('spine');

  useEffect(() => {
    modeRef.current = activeMode;
  }, [activeMode]);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setHasWebGL(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Check WebGL support
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch (e) {
      setHasWebGL(false);
      return;
    }

    let width = container.clientWidth || 500;
    let height = container.clientHeight || 500;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch (e) {
      setHasWebGL(false);
      return;
    }

    // -------------------------------------------------------------
    // MODE 1: CYBERNETIC SPINE & HOLOGRAPHIC LATTICE (HUMAN NEXT)
    // -------------------------------------------------------------
    const spineRoot = new THREE.Group();
    const spineNodes = [];
    const nodeCount = 14;

    for (let i = 0; i < nodeCount; i++) {
      const y = (i - nodeCount / 2) * 0.35;
      const radius = 0.48 - Math.abs(y) * 0.08;

      const ringGeo = new THREE.TorusGeometry(radius, 0.022, 8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00A3E0,
        wireframe: true,
        transparent: true,
        opacity: 0.65,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = y;
      spineRoot.add(ringMesh);

      const coreGeo = new THREE.SphereGeometry(0.11, 12, 12);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0x00C2FF,
        transparent: true,
        opacity: 0.85,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.y = y;
      spineRoot.add(coreMesh);

      spineNodes.push({ ring: ringMesh, core: coreMesh, baseY: y });
    }

    const cageGeo = new THREE.IcosahedronGeometry(2.3, 2);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x007BA7,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    spineRoot.add(cageMesh);

    // -------------------------------------------------------------
    // MODE 2: ROTATING DNA DOUBLE HELIX
    // -------------------------------------------------------------
    const dnaRoot = new THREE.Group();
    dnaRoot.visible = false;
    const basePairCount = 30;
    const dnaRungs = [];

    for (let i = 0; i < basePairCount; i++) {
      const t = (i / basePairCount) * Math.PI * 4;
      const y = (i - basePairCount / 2) * 0.16;
      const r = 0.95;

      const x1 = Math.cos(t) * r;
      const z1 = Math.sin(t) * r;
      const x2 = Math.cos(t + Math.PI) * r;
      const z2 = Math.sin(t + Math.PI) * r;

      // Nucleotide Node 1
      const n1Geo = new THREE.SphereGeometry(0.08, 8, 8);
      const n1Mat = new THREE.MeshBasicMaterial({ color: 0x00C2FF });
      const n1 = new THREE.Mesh(n1Geo, n1Mat);
      n1.position.set(x1, y, z1);
      dnaRoot.add(n1);

      // Nucleotide Node 2
      const n2Geo = new THREE.SphereGeometry(0.08, 8, 8);
      const n2Mat = new THREE.MeshBasicMaterial({ color: 0xC9C2DC });
      const n2 = new THREE.Mesh(n2Geo, n2Mat);
      n2.position.set(x2, y, z2);
      dnaRoot.add(n2);

      // Connecting Hydrogen Bond Rung
      const rungGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x1, y, z1),
        new THREE.Vector3(x2, y, z2),
      ]);
      const rungMat = new THREE.LineBasicMaterial({
        color: 0x007BA7,
        transparent: true,
        opacity: 0.5,
      });
      const rungLine = new THREE.Line(rungGeo, rungMat);
      dnaRoot.add(rungLine);

      dnaRungs.push({ n1, n2, rungLine });
    }

    // -------------------------------------------------------------
    // MODE 3: PULSING ANATOMICAL CARDIAC CORE
    // -------------------------------------------------------------
    const cardiacRoot = new THREE.Group();
    cardiacRoot.visible = false;

    // Outer chamber wireframe (ellipsoid)
    const heartGeo = new THREE.DodecahedronGeometry(1.5, 3);
    const heartMat = new THREE.MeshBasicMaterial({
      color: 0x00A3E0,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    cardiacRoot.add(heartMesh);

    // Inner glowing cardiac chamber
    const innerHeartGeo = new THREE.IcosahedronGeometry(0.9, 2);
    const innerHeartMat = new THREE.MeshBasicMaterial({
      color: 0x00C2FF,
      transparent: true,
      opacity: 0.75,
    });
    const innerHeartMesh = new THREE.Mesh(innerHeartGeo, innerHeartMat);
    cardiacRoot.add(innerHeartMesh);

    // Arterial pulse rings
    const pulseRingGeo = new THREE.TorusGeometry(1.8, 0.03, 8, 48);
    const pulseRingMat = new THREE.MeshBasicMaterial({
      color: 0x007BA7,
      transparent: true,
      opacity: 0.6,
    });
    const pulseRing = new THREE.Mesh(pulseRingGeo, pulseRingMat);
    pulseRing.rotation.x = Math.PI / 4;
    cardiacRoot.add(pulseRing);

    // -------------------------------------------------------------
    // COMMON: ORBITING DATA PARTICLES & SCANNER RING
    // -------------------------------------------------------------
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 2.8 + 0.6;

      posArray[i] = r * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = r * Math.cos(phi);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0x00C2FF,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const scannerRingGeo = new THREE.RingGeometry(2.6, 2.65, 64);
    const scannerRingMat = new THREE.MeshBasicMaterial({
      color: 0x00A3E0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const scannerRing = new THREE.Mesh(scannerRingGeo, scannerRingMat);
    scannerRing.rotation.x = Math.PI / 3;
    scene.add(scannerRing);

    scene.add(spineRoot);
    scene.add(dnaRoot);
    scene.add(cardiacRoot);

    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / height - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Resize handler
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || 500;
      height = container.clientHeight || 500;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    // Tab visibility
    let isTabVisible = true;
    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Animation Loop
    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isTabVisible) return;

      const elapsed = clock.getElapsedTime();
      const currentMode = modeRef.current;

      // Toggle root visibilities
      spineRoot.visible = currentMode === 'spine';
      dnaRoot.visible = currentMode === 'dna';
      cardiacRoot.visible = currentMode === 'cardiac';

      // 1. Common rotations
      particles.rotation.y = -elapsed * 0.08;
      scannerRing.rotation.z = elapsed * 0.22;

      // 2. Mode specific animations
      if (currentMode === 'spine') {
        cageMesh.rotation.y = elapsed * 0.12;
        spineNodes.forEach((node, idx) => {
          const offset = Math.sin(elapsed * 2.5 + idx * 0.4) * 0.08;
          node.core.scale.setScalar(1 + offset * 1.5);
          node.ring.rotation.z = elapsed * 0.3 + idx * 0.1;
        });
        spineRoot.rotation.y = THREE.MathUtils.lerp(spineRoot.rotation.y, mouseX * 0.4, 0.05);
        spineRoot.rotation.x = THREE.MathUtils.lerp(spineRoot.rotation.x, -mouseY * 0.3, 0.05);
      } else if (currentMode === 'dna') {
        dnaRoot.rotation.y = elapsed * 0.35;
        dnaRoot.rotation.x = THREE.MathUtils.lerp(dnaRoot.rotation.x, -mouseY * 0.2, 0.05);
      } else if (currentMode === 'cardiac') {
        // Anatomical heartbeat pulse rhythm
        const pulse = Math.pow(Math.sin(elapsed * 4.0), 10) * 0.25 + 1.0;
        heartMesh.scale.setScalar(pulse);
        innerHeartMesh.scale.setScalar(pulse * 1.15);
        pulseRing.rotation.z = elapsed * 0.4;
        cardiacRoot.rotation.y = elapsed * 0.15;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);

      if (renderer?.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer?.dispose();
    };
  }, []);

  return (
    <div className={`relative w-full h-[450px] md:h-[550px] lg:h-[620px] flex items-center justify-center ${className}`}>
      
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 flex items-center justify-center" />

      {/* Radial Blue Light Background Atmosphere */}
      <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-electric/25 blur-[120px] pointer-events-none" />

      {/* Interactive 3D Model Mode Switcher Pills */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1 rounded-full bg-deepblack/80 border border-electric/30 backdrop-blur-md z-20 shadow-glow-sm">
        <button
          onClick={() => setActiveMode('spine')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition ${
            activeMode === 'spine'
              ? 'bg-electric text-white font-bold shadow-glow-sm'
              : 'text-lavender-dim hover:text-white'
          }`}
        >
          <Cpu className="w-3 h-3" />
          <span>Neural Core</span>
        </button>

        <button
          onClick={() => setActiveMode('dna')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition ${
            activeMode === 'dna'
              ? 'bg-electric text-white font-bold shadow-glow-sm'
              : 'text-lavender-dim hover:text-white'
          }`}
        >
          <Dna className="w-3 h-3" />
          <span>DNA Helix</span>
        </button>

        <button
          onClick={() => setActiveMode('cardiac')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition ${
            activeMode === 'cardiac'
              ? 'bg-electric text-white font-bold shadow-glow-sm'
              : 'text-lavender-dim hover:text-white'
          }`}
        >
          <Activity className="w-3 h-3" />
          <span>Cardiac Pulse</span>
        </button>
      </div>

      {/* Top-Right Holographic Diagnostic Badge */}
      <div className="absolute top-6 right-6 text-right font-mono text-[9px] text-lavender-dim/60 tracking-widest pointer-events-none hidden sm:block">
        <div className="text-electric-light font-bold">BIO-MODEL: {activeMode.toUpperCase()}</div>
        <div>HOLOGRAPHIC SCAN: ACTIVE</div>
        <div>DETERMINISTIC VERIFICATION: 100%</div>
      </div>
    </div>
  );
}
