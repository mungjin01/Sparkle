/* eslint-disable react/no-unknown-property */
import { useAnimations, useGLTF, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { IsEnteredAtom } from "../stores";
import { Loader } from "./Loader";
import gsap from "gsap";
import { useThree } from "@react-three/fiber";

let timeline;
export const Dancer = () => {
  const three = useThree();
  const isEntered = useRecoilValue(IsEnteredAtom);
  const dancerRef = useRef(null);
  const { scene, animations } = useGLTF("models/dancer.glb");
  console.log(scene, animations);

  const { actions } = useAnimations(animations, dancerRef);

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
    timeline.from(
      dancerRef.current.rotation,
      { y: -4 * Math.PI, duration: 4 },
      0.5
    );
  }, [isEntered]);

  if (isEntered) {
    return (
      <>
        <ambientLight intensity={2} />
        <primitive ref={dancerRef} object={scene} scale={0.05} />
      </>
    );
  }
  return <Loader isCompleted />;
};
