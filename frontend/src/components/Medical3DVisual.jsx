import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Medical3DVisual({ className = '' }) {
  const containerRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);

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

    // 1. Cybernetic Spine / Neural Core (inspired by HUMAN NEXT illuminated neck/spine)
    const spineGroup = new THREE.Group();
    const nodeCount = 12;
    const spineNodes = [];

    for (let i = 0; i < nodeCount; i++) {
      const y = (i - nodeCount / 2) * 0.38;
      const radius = 0.45 - Math.abs(y) * 0.08;

      // Outer glowing torus (vertebra ring)
      const ringGeo = new THREE.TorusGeometry(radius, 0.025, 8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00A3E0,
        wireframe: true,
        transparent: true,
        opacity: 0.65,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = y;
      spineGroup.add(ringMesh);

      // Central core luminous node
      const coreGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0x00C2FF,
        transparent: true,
        opacity: 0.85,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.y = y;
      spineGroup.add(coreMesh);

      spineNodes.push({ ring: ringMesh, core: coreMesh, baseY: y });
    }

    // 2. Anatomical Holographic Cage / Cranial Lattice
    const cageGeo = new THREE.IcosahedronGeometry(2.2, 2);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x007BA7,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    scene.add(cageMesh);

    // 3. Inner Data Particles Orbiting (Cloud of medical records & confidence tokens)
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const scaleArray = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 2.8 + 0.5;

      posArray[i] = r * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = r * Math.cos(phi);
      scaleArray[i / 3] = Math.random() * 0.05 + 0.02;
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

    // 4. Orbiting Scanner Rings (Holographic medical scan lines)
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

    scene.add(spineGroup);

    // Mouse interactivity
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

    // Visibility change handler (pause when tab inactive)
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

      // Rotate cage and particles
      cageMesh.rotation.y = elapsed * 0.12;
      cageMesh.rotation.x = Math.sin(elapsed * 0.2) * 0.1;

      particles.rotation.y = -elapsed * 0.08;
      particles.rotation.z = elapsed * 0.04;

      scannerRing.rotation.z = elapsed * 0.25;

      // Pulse spine nodes with wave movement
      spineNodes.forEach((node, idx) => {
        const offset = Math.sin(elapsed * 2.5 + idx * 0.4) * 0.08;
        node.core.scale.setScalar(1 + offset * 1.5);
        node.ring.rotation.z = elapsed * 0.3 + idx * 0.1;
      });

      // Subtle mouse tracking
      spineGroup.rotation.y = THREE.MathUtils.lerp(spineGroup.rotation.y, mouseX * 0.4, 0.05);
      spineGroup.rotation.x = THREE.MathUtils.lerp(spineGroup.rotation.x, -mouseY * 0.3, 0.05);

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);

      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer?.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      scannerRingGeo.dispose();
      scannerRingMat.dispose();
    };
  }, []);

  if (!hasWebGL) {
    // Elegant fallback SVG when WebGL is unavailable or prefers-reduced-motion
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <div className="w-80 h-80 rounded-full border border-electric/30 flex items-center justify-center p-6 bg-deepblack/60 backdrop-blur-xl relative">
          <div className="w-64 h-64 rounded-full border border-dashed border-electric/40 animate-spin" style={{ animationDuration: '30s' }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-electric-light font-bold">
              Medical Hologram
            </span>
            <span className="text-[10px] text-lavender-dim mt-1 font-mono">
              [Deterministic Neural Core Active]
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[450px] md:h-[550px] lg:h-[620px] flex items-center justify-center pointer-events-none ${className}`}
    >
      {/* Background radial blue light gradient behind 3D visual */}
      <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-electric/25 blur-[120px] pointer-events-none" />
      
      {/* Subtle UI overlay markers */}
      <div className="absolute top-8 right-8 text-right font-mono text-[9px] text-lavender-dim/50 tracking-widest hidden md:block">
        <div>CORE // BIO-SYSTEMS</div>
        <div className="text-electric-light">HOLOGRAPHIC SCAN: ACTIVE</div>
        <div>ACCURACY: DETERMINISTIC 100%</div>
      </div>
    </div>
  );
}
