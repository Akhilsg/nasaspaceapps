import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function UnderwaterScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x03544e, 0.1);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);

    mountRef.current.appendChild(renderer.domElement);

    // Resize Handler
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onWindowResize);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x7ec0ee, 1, 100);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);

    // Sea Floor
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x0a0a0a });
    const seaFloor = new THREE.Mesh(floorGeometry, floorMaterial);
    seaFloor.rotation.x = -Math.PI / 2;
    seaFloor.position.y = -5;
    scene.add(seaFloor);

    // Load the Jellyfish Model
    const loader = new GLTFLoader();
    let jellyfish;

    // Import the model using Vite's asset handling
    const jellyfishUrl = new URL("./jellyfish.glb", import.meta.url).href;

    loader.load(
      jellyfishUrl,
      (gltf) => {
        jellyfish = gltf.scene;
        jellyfish.position.set(0, 0, 0);
        scene.add(jellyfish);
      },
      undefined,
      (error) => {
        console.error("An error happened while loading the model:", error);
      }
    );

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the torus (if you decide to keep it)
      // torus.rotation.x += 0.01;
      // torus.rotation.y += 0.01;

      // Animate the jellyfish (e.g., bobbing up and down)
      if (jellyfish) {
        jellyfish.rotation.y += 0.005;
        jellyfish.position.y = Math.sin(Date.now() * 0.001) * 0.5;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", onWindowResize);
      mountRef.current.removeChild(renderer.domElement);

      // Dispose geometries and materials
      floorGeometry.dispose();
      floorMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} />;
}

export default UnderwaterScene;
