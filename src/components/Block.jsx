import React, { useState } from 'react';
import { useSpring, animated, to } from '@react-spring/three';

const dirToRotation = {
  up: [0, 0, 0],
  down: [0, 0, Math.PI],
  left: [0, 0, Math.PI / 2],
  right: [0, 0, -Math.PI / 2],
  forward: [Math.PI / 2, 0, 0],
  backward: [-Math.PI / 2, 0, 0]
};

// A flat 2D-like arrow made of basic shapes to stick to the face
function FlatArrow({ opacity }) {
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <coneGeometry args={[0.15, 0.25, 3]} />
        <animated.meshBasicMaterial color="white" transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <planeGeometry args={[0.1, 0.3]} />
        <animated.meshBasicMaterial color="white" transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

export default function Block({ position, direction, onClick, isShaking, isFlying }) {
  const [hovered, setHover] = useState(false);

  // Animation for shaking
  const { shakeX } = useSpring({
    from: { shakeX: 0 },
    to: { shakeX: isShaking ? 0.2 : 0 },
    config: { mass: 1, tension: 500, friction: 10 },
    reset: isShaking,
  });

  // Animation for flying
  const { flyPos, opacity } = useSpring({
    flyPos: isFlying ? getFlyTarget(position, direction) : position,
    opacity: isFlying ? 0 : 1,
    config: { duration: 500 }
  });

  function getFlyTarget(pos, dir) {
    const dist = 10;
    switch(dir) {
      case 'up': return [pos[0], pos[1] + dist, pos[2]];
      case 'down': return [pos[0], pos[1] - dist, pos[2]];
      case 'left': return [pos[0] - dist, pos[1], pos[2]];
      case 'right': return [pos[0] + dist, pos[1], pos[2]];
      case 'forward': return [pos[0], pos[1], pos[2] + dist];
      case 'backward': return [pos[0], pos[1], pos[2] - dist];
      default: return pos;
    }
  }

  return (
    <animated.group
      position={to([flyPos, shakeX], (fP, sX) => [fP[0] + sX, fP[1], fP[2]])}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
      }}
      onPointerOut={() => setHover(false)}
    >
      <mesh>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <animated.meshStandardMaterial
          color={hovered ? '#e94560' : '#0f3460'}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Container for Arrows, rotated based on block's escape direction */}
      <group rotation={dirToRotation[direction]}>

        {/* The block escapes in the "up" local direction (+Y axis).
            We want ALL arrows to lie flat on the faces and point towards local +Y.
            The FlatArrow is drawn on the XY plane pointing +Y. */}

        {/* Front Face (+Z): Arrow pointing up (+Y) */}
        <group position={[0, 0, 0.46]}>
           <FlatArrow opacity={opacity} />
        </group>

        {/* Back Face (-Z): Arrow pointing up (+Y)
            Rotate 180 deg around Y so it faces out of the -Z face */}
        <group position={[0, 0, -0.46]} rotation={[0, Math.PI, 0]}>
           <FlatArrow opacity={opacity} />
        </group>

        {/* Right Face (+X): Arrow pointing up (+Y)
            Rotate 90 deg around Y so it faces out of the +X face */}
        <group position={[0.46, 0, 0]} rotation={[0, Math.PI/2, 0]}>
           <FlatArrow opacity={opacity} />
        </group>

        {/* Left Face (-X): Arrow pointing up (+Y)
            Rotate -90 deg around Y so it faces out of the -X face */}
        <group position={[-0.46, 0, 0]} rotation={[0, -Math.PI/2, 0]}>
           <FlatArrow opacity={opacity} />
        </group>

        {/* Top Face (+Y):
            Since the block moves +Y, we want the arrow on the top face to point towards -Z
            so it visually aligns with moving "forward" in the top-down perspective.
            Rotate -90 deg around X to lie flat on +Y face, then point towards -Z. */}
        <group position={[0, 0.46, 0]} rotation={[-Math.PI/2, 0, 0]}>
           <FlatArrow opacity={opacity} />
        </group>

        {/* Bottom Face (-Y):
            Lie flat on -Y face and point towards +Z.
            Rotate 90 deg around X. */}
        <group position={[0, -0.46, 0]} rotation={[Math.PI/2, 0, 0]}>
           <FlatArrow opacity={opacity} />
        </group>

      </group>
    </animated.group>
  );
}
