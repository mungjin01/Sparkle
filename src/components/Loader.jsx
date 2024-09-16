import { useRecoilState } from "recoil";
import { IsEnteredAtom } from "../stores";
import { useProgress } from "@react-three/drei";
import { Html } from "@react-three/drei";
import styled from "styled-components";
import { keyframes } from "styled-components";

export const Loader = (isCompleted) => {
  const [isEntered, setIsEntered] = useRecoilState(IsEnteredAtom);

  const progress = useProgress();
  if (isEntered) return null;
  return (
    <Html center>
      <BlurredBackground />
      <Container>
        <ProgressBar>{isCompleted ? 100 : progress.progress}%</ProgressBar>
        <EnterBtn
          onClick={() => {
            setIsEntered(true);
          }}
        >
          Enter
        </EnterBtn>
      </Container>
    </Html>
  );
};

const blink = keyframes`
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
    `;

const BlurredBackground = styled.div`
  width: 400px;
  height: 400px;
  background-color: red;
  border-radius: 50%;
  filter: blur(300px);
`;

const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 20px;
  align-items: center;
`;

const ProgressBar = styled.div`
  font-size: 20px;
  color: white;
`;
const EnterBtn = styled.div`
  animation: ${blink} 1.5s infinite;
  transition: 0.4s;
  font-size: 16px;
  outline: none;
  border: 0.5px solid #999;
  padding: 8px 18px;
  background-color: transparent;
  color: #ccc;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: #ccc;
    color: red;
  }
`;
