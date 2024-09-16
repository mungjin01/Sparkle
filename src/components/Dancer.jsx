/* eslint-disable react/no-unknown-property */
import {
  useAnimations,
  useGLTF,
  useScroll,
  useTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { useRecoilValue } from "recoil";
import { IsEnteredAtom } from "../stores";
import { Loader } from "./Loader";
import gsap from "gsap";
import { useThree } from "@react-three/fiber";
import { Box } from "@react-three/drei";
import * as THREE from "three";
import { Circle } from "@react-three/drei";
import { Points } from "@react-three/drei";

let timeline;
export const Dancer = () => {
  const three = useThree();
  const isEntered = useRecoilValue(IsEnteredAtom);
  const dancerRef = useRef(null);
  const { scene, animations } = useGLTF("models/dancer.glb");
  console.log(scene, animations);

  const texture = useTexture("texture/sparkle.png");
  const { actions } = useAnimations(animations, dancerRef);

  const { positions } = useMemo(() => {
    const count = 250;
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
  });

  useEffect(() => {
    if (!isEntered) return;
    actions["wave"].play();
  }, [actions, isEntered]);

  useEffect(() => {
    if (!isEntered) return;
    if (!dancerRef.current) return;
    gsap.fromTo(
      three.camera.position,
      { x: -5, y: 5, z: 5 },
      { x: 0, y: 6, z: 12, duration: 2.5 }
    );
    gsap.fromTo(three.camera.rotation, { z: Math.PI }, { z: 0, duration: 2.5 });
  }, [isEntered, three.camera.position, three.camera.rotation]);

  useEffect(() => {
    if (!isEntered) return;
    if (!dancerRef.current) return;
    timeline = gsap.timeline();
    timeline
      .from(dancerRef.current.rotation, { y: -4 * Math.PI, duration: 4 }, 0.5)
      .from(dancerRef.current.position, { x: 3, duration: 4 }, "<")
      .to(three.camera.position, { x: 2, z: 8, duration: 10 }, "<")
      .to(three.camera.position, { x: 0, z: 6, duration: 10 })
      .to(three.camera.position, { x: 0, z: 16, duration: 10 });
  }, [isEntered, three.camera.position]);

  if (isEntered) {
    return (
      <>
        <primitive ref={dancerRef} object={scene} scale={0.05} />
        <ambientLight intensity={2} />
        <rectAreaLight position={[0, 10, 0]} intensity={30} />
        <pointLight
          position={[0, 5, 0]}
          intensity={45}
          castShadow
          receiveShadow
        />
        <hemisphereLight
          position={[0, 5, 0]}
          intensity={0}
          groundColor={"Lime"}
          color="blue"
        />
        <Box position={[0, 0, 0]} args={[100, 100, 100]}>
          <meshStandardMaterial color="#DC4F00" side={THREE.DoubleSide} />
        </Box>
        <Circle
          castShadow
          receiveShadow
          args={[8, 32]}
          rotation-x={Math.PI / 2}
          position-y={-4.4}
        >
          <meshStandardMaterial color="#DC4F00" side={THREE.DoubleSide} />
        </Circle>

        <Points positions={positions.slice(0, positions.length / 3)}>
          <pointsMaterial
            size={0.5}
            color={new THREE.Color("#DC4F00")}
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
            size={0.5}
            color={new THREE.Color("#DC4F00")}
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
            size={0.5}
            color={new THREE.Color("#DC4F00")}
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
