/* eslint-disable react/no-unknown-property */
import {
  useAnimations,
  useGLTF,
  useScroll,
  useTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRecoilValue } from "recoil";
import { IsEnteredAtom } from "../stores";
import { Loader } from "./Loader";
import gsap from "gsap";
import { useThree } from "@react-three/fiber";
import { Box } from "@react-three/drei";
import * as THREE from "three";
import { Sphere } from "@react-three/drei";
import { Points } from "@react-three/drei";

let timeline;

const colors = {
  boxMaterialColor: "#2A3967",
};

export const Dancer = () => {
  const three = useThree();
  const isEntered = useRecoilValue(IsEnteredAtom);
  const dancerRef = useRef(null);
  const boxRef = useRef(null);
  const starGroupRef1 = useRef(null);
  const starGroupRef2 = useRef(null);
  const starGroupRef3 = useRef(null);
  const rectAreaLightRef = useRef(null);
  const hemisphereLightRef = useRef(null);

  const { scene, animations } = useGLTF("models/real_keyboard_test.glb");
  console.log(scene, animations);

  const texture = useTexture("texture/sparkle.png");
  const { actions } = useAnimations(animations, dancerRef);

  const [currentAnimation, setCurrentAnimation] = useState("piano");
  const [rotateFinished, setRotateFinished] = useState(false);

  const { positions } = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 1) {
      positions[i] = (Math.random() - 0.5) * 25;
    }
    return { positions };
  }, []);

  const scroll = useScroll();
  console.log(scroll);

  useFrame(() => {
    if (!isEntered) return;
    timeline.seek(scroll.offset * timeline.duration());
    boxRef.current.material.color = new THREE.Color(colors.boxMaterialColor);

    if (rotateFinished) {
      setCurrentAnimation("piano");
    } else {
      setCurrentAnimation("wave");
    }
  });

  useEffect(() => {
    if (!isEntered) return;
    three.camera.lookAt(1, 2, 0);
    actions["piano"].play();
    three.scene.background = new THREE.Color(colors.boxMaterialColor);
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [actions, isEntered, scene, three.camera, three.scene]);

  useEffect(() => {
    let timeout;
    if (currentAnimation === "piano") {
      actions[currentAnimation]?.reset().fadeIn(0.5).play();
    } else {
      actions[currentAnimation]
        ?.reset()
        .fadeIn(0.5)
        .play()
        .setLoop(THREE.LoopOnce, 1);

      timeout = setTimeout(() => {
        if (actions[currentAnimation]) {
          actions[currentAnimation].paused = true;
        }
      }, 8000);
      return () => {
        clearTimeout(timeout);
        actions[currentAnimation]?.reset().fadeOut(0.5).stop();
      };
    }
  }, [actions, currentAnimation]);

  useEffect(() => {
    if (!isEntered) return;
    if (!dancerRef.current) return;
    gsap.fromTo(
      three.camera.position,
      { x: -5, y: 5, z: 5 },
      { x: 0, y: 6, z: 12, duration: 2.5 }
    );
    gsap.fromTo(three.camera.rotation, { z: Math.PI }, { z: 0, duration: 2.5 });
    gsap.fromTo(
      colors,
      { boxMaterialColor: "#0C0400" },
      { duration: 2.5, boxMaterialColor: "#2A3967" }
    );
    gsap.to(starGroupRef1.current, {
      yoyo: true,
      duration: 1,
      repeat: -1,
      ease: "linear",
      size: 0.05,
    });

    gsap.to(starGroupRef2.current, {
      yoyo: true,
      duration: 1,
      repeat: -1,
      ease: "linear",
      size: 0.05,
    });

    gsap.to(starGroupRef3.current, {
      yoyo: true,
      duration: 2,
      repeat: -1,
      ease: "linear",
      size: 0.05,
    });
  }, [isEntered, three.camera.position, three.camera.rotation]);

  useEffect(() => {
    if (!isEntered) return;
    if (!dancerRef.current) return;
    const pivot = new THREE.Group();
    pivot.position.copy(dancerRef.current.position);
    pivot.add(three.camera);
    three.scene.add(pivot);

    timeline = gsap.timeline();
    timeline
      .from(dancerRef.current.rotation, { y: -4 * Math.PI, duration: 4 }, 0.5)
      .from(dancerRef.current.position, { x: 3, duration: 4 }, "<")
      .to(three.camera.position, { x: 2, z: 8, duration: 10 }, "<")
      .to(colors, { duration: 10, boxMaterialColor: "#0C0400" }, "<")
      .to(pivot.rotation, { y: Math.PI, duration: 10 })
      .to(three.camera.position, { x: -4, z: 12, duration: 10 })
      .to(three.camera.position, { x: 0, z: 6, duration: 10 })
      .to(three.camera.position, {
        x: 0,
        z: 16,
        duration: 10,
        onUpdate: () => {
          setRotateFinished(false);
        },
      })
      .to(hemisphereLightRef.current, { intensity: 30, duration: 5 })
      .to(
        pivot.rotation,
        {
          y: 4 * Math.PI,
          duration: 15,
          onUpdate: () => {
            setRotateFinished(true);
          },
        },
        "<"
      )
      .to(colors, { duration: 15, boxMaterialColor: "#2A3967" });
    return () => three.scene.remove(pivot);
  }, [isEntered, three.camera, three.camera.position, three.scene]);

  if (isEntered) {
    return (
      <>
        <primitive
          ref={dancerRef}
          object={scene}
          scale={0.03}
          position={[0, 0, 0]}
        />
        <ambientLight intensity={2} />
        <rectAreaLight
          ref={rectAreaLightRef}
          position={[0, 10, 0]}
          intensity={30}
        />
        <pointLight
          position={[0, 5, 0]}
          intensity={45}
          castShadow
          receiveShadow
        />
        <hemisphereLight
          ref={hemisphereLightRef}
          position={[0, 5, 0]}
          intensity={0}
          groundColor={"Lime"}
          color="blue"
        />
        <Box ref={boxRef} position={[0, 0, 0]} args={[100, 100, 100]}>
          <meshStandardMaterial color="#2A3967" side={THREE.DoubleSide} />
        </Box>
        <Sphere
          castShadow
          receiveShadow
          args={[6, 32]}
          rotation-x={Math.PI / 2}
          position={[0, -6, 0]}
        >
          <meshStandardMaterial color="#29465E" side={THREE.DoubleSide} />
        </Sphere>

        <Points positions={positions.slice(0, positions.length / 3)}>
          <pointsMaterial
            ref={starGroupRef1}
            size={0.5}
            color={new THREE.Color("#E0F0FD")}
            sizeAttenuation
            depthWrite
            alphaMap={texture}
            transparent
            alphaTest={0.001}
          />
        </Points>
        <Points
          positions={positions.slice(
            positions.length / 3,
            (positions.length * 2) / 3
          )}
        >
          <pointsMaterial
            ref={starGroupRef2}
            size={0.5}
            color={new THREE.Color("#E0F0FD")}
            sizeAttenuation
            depthWrite
            alphaMap={texture}
            transparent
            alphaTest={0.001}
          />
        </Points>
        <Points
          positions={positions.slice(
            (positions.length * 2) / 3,
            positions.length
          )}
        >
          <pointsMaterial
            ref={starGroupRef3}
            size={0.5}
            color={new THREE.Color("#E0F0FD")}
            sizeAttenuation
            depthWrite
            alphaMap={texture}
            transparent
            alphaTest={0.001}
          />
        </Points>
      </>
    );
  }
  return <Loader isCompleted />;
};
