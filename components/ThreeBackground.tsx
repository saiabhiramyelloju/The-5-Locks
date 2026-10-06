"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { prefersReducedMotion } from '../lib/anime';

export const ThreeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    const reducedMotion = prefersReducedMotion();
    const particleCount = isMobile ? 35 : 75;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050811, 0.0018);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 120;

    // 2. Renderer
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'low-power',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL init failed:', e);
      setWebGLSupported(false);
      return;
    }

    // 3. Subtle Cyber Geometry: Floating Security Rings / Torus lattice
    const ringGeo = new THREE.TorusGeometry(38, 0.35, 8, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    scene.add(ringMesh);

    const innerRingGeo = new THREE.TorusGeometry(22, 0.25, 6, 36);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRingMesh.rotation.y = Math.PI / 4;
    scene.add(innerRingMesh);

    // 4. Floating Particles & Connection Lines
    const particleCoords = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particleCoords[i * 3] = (Math.random() - 0.5) * 220;
      particleCoords[i * 3 + 1] = (Math.random() - 0.5) * 160;
      particleCoords[i * 3 + 2] = (Math.random() - 0.5) * 120;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.08,
        y: (Math.random() - 0.5) * 0.08,
        z: (Math.random() - 0.5) * 0.04,
      });
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particleCoords, 3));

    const particlesMat = new THREE.PointsMaterial({
      color: 0x22d3ee,
      size: isMobile ? 2 : 2.5,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // Connecting Lines Buffer (Connect nearest nodes)
    const maxLines = isMobile ? 30 : 60;
    const linePositions = new Float32Array(maxLines * 6);
    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const linesMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.12,
    });
    const lines = new THREE.LineSegments(linesGeo, linesMat);
    scene.add(lines);

    // 5. Animation loop
    let animId: number;
    let clock = new THREE.Clock();

    const animateScene = () => {
      animId = requestAnimationFrame(animateScene);

      const delta = Math.min(clock.getDelta(), 0.1);
      const speedFactor = reducedMotion ? 0.05 : 1;

      // Slow rotation of security rings
      ringMesh.rotation.z += 0.08 * delta * speedFactor;
      ringMesh.rotation.y += 0.04 * delta * speedFactor;
      innerRingMesh.rotation.x -= 0.06 * delta * speedFactor;
      innerRingMesh.rotation.z += 0.03 * delta * speedFactor;

      if (!reducedMotion) {
        // Drift particles
        const posAttr = particlesGeo.attributes.position as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          posArray[i * 3] += particleVelocities[i].x * speedFactor;
          posArray[i * 3 + 1] += particleVelocities[i].y * speedFactor;
          posArray[i * 3 + 2] += particleVelocities[i].z * speedFactor;

          // Wrap boundaries
          if (posArray[i * 3] > 110) posArray[i * 3] = -110;
          if (posArray[i * 3] < -110) posArray[i * 3] = 110;
          if (posArray[i * 3 + 1] > 80) posArray[i * 3 + 1] = -80;
          if (posArray[i * 3 + 1] < -80) posArray[i * 3 + 1] = 80;
        }
        posAttr.needsUpdate = true;

        // Update proximity lines
        let lineIdx = 0;
        const maxDist = 45;
        for (let i = 0; i < particleCount && lineIdx < maxLines; i++) {
          for (let j = i + 1; j < particleCount && lineIdx < maxLines; j++) {
            const dx = posArray[i * 3] - posArray[j * 3];
            const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
            const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < maxDist) {
              linePositions[lineIdx * 6] = posArray[i * 3];
              linePositions[lineIdx * 6 + 1] = posArray[i * 3 + 1];
              linePositions[lineIdx * 6 + 2] = posArray[i * 3 + 2];

              linePositions[lineIdx * 6 + 3] = posArray[j * 3];
              linePositions[lineIdx * 6 + 4] = posArray[j * 3 + 1];
              linePositions[lineIdx * 6 + 5] = posArray[j * 3 + 2];
              lineIdx++;
            }
          }
        }
        linesGeo.setDrawRange(0, lineIdx * 2);
        (linesGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      }

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animId = requestAnimationFrame(animateScene);

    // 6. Handle resize
    const handleResize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);

      ringGeo.dispose();
      ringMat.dispose();
      innerRingGeo.dispose();
      innerRingMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      linesGeo.dispose();
      linesMat.dispose();

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Background fallback gradient in case WebGL is unavailable or while loading */}
      <div className="absolute inset-0 bg-[#050811] -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.12),rgba(255,255,255,0))] -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_120%,rgba(16,185,129,0.08),rgba(0,0,0,0))] -z-10" />
    </div>
  );
};
