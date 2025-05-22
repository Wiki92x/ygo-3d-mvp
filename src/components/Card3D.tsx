'use client';

import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

type Card3DProps = {
  position: [number, number, number];
  img: string;
  isSelected?: boolean;
  rotationY?: number;
  onClick?: () => void;
  faceDown?: boolean;
  name?: string;
};

export default function Card3D({
  position,
  img,
  isSelected = false,
  rotationY = 0,
  onClick,
  faceDown = false,
}: Card3DProps) {
  const texture = useLoader(TextureLoader, img);
  return (
    <mesh
      position={position}
      rotation={[0, rotationY, 0]}
      scale={isSelected ? [1.08, 1.08, 1] : [1, 1, 1]}
      onClick={onClick}
      castShadow
      receiveShadow
      // @ts-ignore
      style={{ cursor: 'pointer' }}
    >
      <planeGeometry args={[2.5, 3.5]} />
      <meshStandardMaterial
        map={!faceDown ? texture : undefined}
        color={faceDown ? '#999' : '#fff'}
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
}