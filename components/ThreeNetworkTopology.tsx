"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { prefersReducedMotion } from '../lib/anime';

interface ThreeNetworkTopologyProps {
  isBlocking?: boolean;
  selectedRequestId?: number | null;
}

export const ThreeNetworkTopology: React.FC<ThreeNetworkTopologyProps> = ({
  isBlocking = false,
  selectedRequestId = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isBlockingRef = useRef(isBlocking);
  const selectedReqRef = useRef(selectedRequestId);

  useEffect(() => {
    isBlockingRef.current = isBlocking;
    selectedReqRef.current = selectedRequestId;
  }, [isBlocking, selectedRequestId]);

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
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      500
    );
    camera.position.set(0, 0, 75);

    const reducedMotion = prefersReducedMotion();

    // Node definitions (3D positions)
    // Internet (top)
    // Firewall Barrier (middle)
    // Target Servers (bottom): Web, Mail, Admin, Printer, Backup
    const nodes = {
      internet: new THREE.Vector3(0, 22, 0),
      firewall: new THREE.Vector3(0, 5, 0),
      web: new THREE.Vector3(-24, -18, 0),
      mail: new THREE.Vector3(-12, -18, 0),
      admin: new THREE.Vector3(0, -18, 0),
      printer: new THREE.Vector3(12, -18, 0),
      backup: new THREE.Vector3(24, -18, 0),
    };

    // Meshes for Nodes
    const nodeMeshes: THREE.Mesh[] = [];
    const nodeGeo = new THREE.SphereGeometry(1.4, 16, 16);

    const createNodeMesh = (pos: THREE.Vector3, color: number) => {
      const mat = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(nodeGeo, mat);
      mesh.position.copy(pos);
      scene.add(mesh);
      nodeMeshes.push(mesh);
      return mesh;
    };

    createNodeMesh(nodes.internet, 0x38bdf8); // Cyan
    const firewallNode = createNodeMesh(nodes.firewall, 0xef4444); // Red
    createNodeMesh(nodes.web, 0x10b981);
    createNodeMesh(nodes.mail, 0x10b981);
    createNodeMesh(nodes.admin, 0x10b981);
    createNodeMesh(nodes.printer, 0x10b981);
    createNodeMesh(nodes.backup, 0x10b981);

    // Firewall Barrier Plane
    const barrierGeo = new THREE.PlaneGeometry(58, 2.8);
    const barrierMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const barrierMesh = new THREE.Mesh(barrierGeo, barrierMat);
    barrierMesh.position.set(0, 5, 0);
    scene.add(barrierMesh);

    // Connecting Network Paths
    const pathConnections: [THREE.Vector3, THREE.Vector3][] = [
      [nodes.internet, nodes.firewall],
      [nodes.firewall, nodes.web],
      [nodes.firewall, nodes.mail],
      [nodes.firewall, nodes.admin],
      [nodes.firewall, nodes.printer],
      [nodes.firewall, nodes.backup],
    ];

    const linesMat = new THREE.LineBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.35,
    });

    pathConnections.forEach(([p1, p2]) => {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const line = new THREE.Line(lineGeo, linesMat);
      scene.add(line);
    });

    // Animated Packets (Subtle moving dots across connections)
    const packetCount = 12;
    const packetGeo = new THREE.SphereGeometry(0.7, 8, 8);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const packetMeshes: { mesh: THREE.Mesh; p1: THREE.Vector3; p2: THREE.Vector3; progress: number; speed: number }[] = [];

    const targetServers = [nodes.web, nodes.mail, nodes.admin, nodes.printer, nodes.backup];

    for (let i = 0; i < packetCount; i++) {
      const mesh = new THREE.Mesh(packetGeo, packetMat);
      const isIngress = Math.random() > 0.4;
      const p1 = isIngress ? nodes.internet : nodes.firewall;
      const p2 = isIngress ? nodes.firewall : targetServers[Math.floor(Math.random() * targetServers.length)];

      scene.add(mesh);
      packetMeshes.push({
        mesh,
        p1,
        p2,
        progress: Math.random(),
        speed: 0.006 + Math.random() * 0.008,
      });
    }

    // Animation loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const blocking = isBlockingRef.current;

      // Firewall barrier pulsing
      if (blocking) {
        barrierMat.opacity = 0.6 + Math.sin(clock.getElapsedTime() * 12) * 0.3;
        barrierMat.color.setHex(0xff0033);
        firewallNode.scale.setScalar(1.4 + Math.sin(clock.getElapsedTime() * 10) * 0.3);
      } else {
        barrierMat.opacity = 0.2 + Math.sin(clock.getElapsedTime() * 2) * 0.1;
        barrierMat.color.setHex(0x0284c7);
        firewallNode.scale.setScalar(1);
      }

      // Move packets
      if (!reducedMotion) {
        packetMeshes.forEach((pkt) => {
          pkt.progress += pkt.speed * (blocking ? 0.3 : 1);
          if (pkt.progress > 1) {
            pkt.progress = 0;
            // Switch to lower hop or top hop
            if (pkt.p1 === nodes.internet) {
              pkt.p1 = nodes.firewall;
              pkt.p2 = targetServers[Math.floor(Math.random() * targetServers.length)];
            } else {
              pkt.p1 = nodes.internet;
              pkt.p2 = nodes.firewall;
            }
          }
          pkt.mesh.position.lerpVectors(pkt.p1, pkt.p2, pkt.progress);
        });
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
      nodeGeo.dispose();
      barrierGeo.dispose();
      barrierMat.dispose();
      linesMat.dispose();
      packetGeo.dispose();
      packetMat.dispose();
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden bg-black/40 border border-white/10 backdrop-blur-md mb-6">
      <div ref={containerRef} className="absolute inset-0 pointer-events-none" />

      {/* Futuristic overlay labels */}
      <div className="absolute top-2 left-3 flex items-center gap-2 font-mono text-[10px] tracking-widest text-cyan-400 uppercase">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        NOC TOPOLOGY MONITOR
      </div>

      <div className="absolute top-2 right-3 font-mono text-[10px] text-gray-500 uppercase">
        {isBlocking ? (
          <span className="text-red-400 font-bold animate-pulse">● FIREWALL BLOCK ENGAGED</span>
        ) : (
          <span>TRAFFIC: NORMAL [INSPECTING]</span>
        )}
      </div>

      <div className="absolute bottom-2 inset-x-3 flex justify-between font-mono text-[9px] text-gray-400 uppercase pointer-events-none">
        <span>WEB</span>
        <span>MAIL</span>
        <span className="text-cyan-400">ADMIN</span>
        <span>PRINT</span>
        <span>BACKUP</span>
      </div>
    </div>
  );
};
