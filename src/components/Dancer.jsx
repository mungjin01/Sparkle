/* eslint-disable react/no-unknown-property */
import { Loader, useAnimations, useGLTF, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { IsEnteredAtom } from "../stores";

export const Dancer = () => {
  const isEntered = useRecoilValue(IsEnteredAtom);
  const dancerRef = useRef(null);
  const { scene, animations } = useGLTF("models/dancer.glb");
  console.log(scene, animations);

  const { actions } = useAnimations(animations, dancerRef);

  const scroll = useScroll();
  console.log(scroll);

  useFrame(() => {});

  useEffect(() => {
    if (!isEntered) return;
    actions["wave"].play();
  }, [actions, isEntered]);

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
