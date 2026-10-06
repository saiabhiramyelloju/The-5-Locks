"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { prefersReducedMotion } from '../lib/anime';

interface ThreeVictorySceneProps {
  activeStage: number; // 0 to 5 (how many lock nodes are currently unlocked)
  isFullyActive: boolean;
}

export const ThreeVictoryScene: React.FC<ThreeVictorySceneProps> = ({
  activeStage,
  isFullyActive,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef(activeStage);
  const fullRef = useRef(isFullyActive);

  useEffect(() => {
    stageRef.current = activeStage;
    fullRef.current = isFullyActive;
  }, [activeStage, isFullyActive]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      500
    );
    camera.position.set(0, 0, 80);

    const reducedMotion = prefersReducedMotion();

    // Central Core
    const coreGeo = new THREE.SphereGeometry(3.6, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Core Halo Ring
    const haloGeo = new THREE.TorusGeometry(6.5, 0.25, 8, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.4,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    scene.add(haloMesh);

    // 5 Pentagon nodes surrounding the core
    const nodeCount = 5;
    const radius = 28;
    const nodeMeshes: THREE.Mesh[] = [];
    const nodePositions: THREE.Vector3[] = [];
    const nodeGeo = new THREE.SphereGeometry(1.8, 16, 16);

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i * 2 * Math.PI) / nodeCount - Math.PI / 2;
      const pos = new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      );
      nodePositions.push(pos);

      const mat = new THREE.MeshBasicMaterial({
        color: 0x334155, // Inactive slate gray
        transparent: true,
        opacity: 0.6,
      });
      const mesh = new THREE.Mesh(nodeGeo, mat);
      mesh.position.copy(pos);
      scene.add(mesh);
      nodeMeshes.push(mesh);
    }

    // Radial Connection Lines to Core
    const coreLines: THREE.Line[] = [];
    const coreLineMats: THREE.LineBasicMaterial[] = [];

    nodePositions.forEach((pos) => {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        pos,
      ]);
      const mat = new THREE.LineBasicMaterial({
        color: 0x1e293b,
        transparent: true,
        opacity: 0.3,
      });
      const line = new THREE.Line(lineGeo, mat);
      scene.add(line);
      coreLines.push(line);
      coreLineMats.push(mat);
    });

    // Perimeter Network Lines (Connecting adjacent nodes)
    const perimLineGeo = new THREE.BufferGeometry().setFromPoints([
      ...nodePositions,
      nodePositions[0],
    ]);
    const perimLineMat = new THREE.LineBasicMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.3,
    });
    const perimLine = new THREE.Line(perimLineGeo, perimLineMat);
    scene.add(perimLine);

    // Subtle celebration particle sparks around perimeter
    const particleCount = 40;
    const partCoords = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = radius * (0.8 + Math.random() * 0.4);
      partCoords[i * 3] = Math.cos(theta) * r;
      partCoords[i * 3 + 1] = Math.sin(theta) * r;
      partCoords[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute('position', new THREE.BufferAttribute(partCoords, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 1.8,
      transparent: true,
      opacity: 0.3,
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const t = clock.getElapsedTime();
      const currentStage = stageRef.current;
      const isComplete = fullRef.current;

      // Update Node & Line activations based on currentStage
      nodeMeshes.forEach((mesh, idx) => {
        const mat = mesh.material as THREE.MeshBasicMaterial;
        const lineMat = coreLineMats[idx];

        if (idx < currentStage) {
          // Activated Node
          mat.color.setHex(isComplete ? 0x10b981 : 0x06b6d4); // emerald / cyan
          mat.opacity = 0.95;
          mesh.scale.setScalar(1 + Math.sin(t * 3 + idx) * 0.15);

          lineMat.color.setHex(isComplete ? 0x10b981 : 0x06b6d4);
          lineMat.opacity = isComplete ? 0.75 : 0.55;
        } else {
          mat.color.setHex(0x334155);
          mat.opacity = 0.4;
          mesh.scale.setScalar(1);

          lineMat.color.setHex(0x1e293b);
          lineMat.opacity = 0.2;
        }
      });

      if (isComplete) {
        perimLineMat.color.setHex(0x10b981);
        perimLineMat.opacity = 0.7;
        coreMat.color.setHex(0x10b981);
        coreMat.opacity = 0.9;
        coreMesh.scale.setScalar(1.2 + Math.sin(t * 2) * 0.1);
        haloMat.color.setHex(0x34d399);
        haloMat.opacity = 0.8;
      }

      if (!reducedMotion) {
        // Slow rotation of entire scene network
        scene.rotation.z += 0.08 * delta;
        haloMesh.rotation.x += 0.3 * delta;
        haloMesh.rotation.y += 0.2 * delta;
        particles.rotation.z -= 0.05 * delta;
      }

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      coreGeo.dispose();
      coreMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      nodeGeo.dispose();
      perimLineGeo.dispose();
      perimLineMat.dispose();
      partGeo.dispose();
      partMat.dispose();
      nodeMeshes.forEach(m => (m.material as THREE.Material).dispose());
      coreLineMats.forEach(m => m.dispose());
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
