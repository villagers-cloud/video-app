import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Block from './Block';
import { levels } from '../levels';

export default function Game({ levelIndex, onWin }) {
  const [blocks, setBlocks] = useState([]);
  const [shakingId, setShakingId] = useState(null);

  // Initialize level
  useEffect(() => {
    // Deep copy level so we can mutate removed state
    setBlocks(JSON.parse(JSON.stringify(levels[levelIndex])));
    setShakingId(null);
  }, [levelIndex]);

  const handleBlockClick = (clickedBlock) => {
    if (clickedBlock.removed || clickedBlock.isFlying) return;

    if (canMove(clickedBlock, blocks)) {
      // Mark as flying immediately so it stops blocking others
      setBlocks(prev => prev.map(b =>
        b.id === clickedBlock.id ? { ...b, isFlying: true } : b
      ));

      // After animation completes, mark as removed
      setTimeout(() => {
        setBlocks(prev => {
          const next = prev.map(b =>
            b.id === clickedBlock.id ? { ...b, removed: true } : b
          );

          // Check win condition
          if (next.every(b => b.removed)) {
            onWin();
          }
          return next;
        });
      }, 500); // Wait for spring animation duration

    } else {
      setShakingId(clickedBlock.id);
      setTimeout(() => setShakingId(null), 300);
    }
  };

  const canMove = (block, allBlocks) => {
    let { x, y, z, dir } = block;

    // Check path up to a max grid distance (e.g. 10)
    for (let step = 1; step <= 10; step++) {
      if (dir === 'up') y++;
      else if (dir === 'down') y--;
      else if (dir === 'left') x--;
      else if (dir === 'right') x++;
      else if (dir === 'forward') z++;
      else if (dir === 'backward') z--;

      // If we find an active, non-flying block in the way
      const blockingBlock = allBlocks.find(b =>
        !b.removed && !b.isFlying && b.x === x && b.y === y && b.z === z
      );

      if (blockingBlock) {
        return false; // Blocked!
      }
    }
    return true; // Path clear
  };

  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Environment preset="city" />

      {/* Center the group roughly based on the origin */}
      <group>
        {blocks.map(block => (
          !block.removed && (
            <Block
              key={block.id}
              position={[block.x, block.y, block.z]}
              direction={block.dir}
              isShaking={shakingId === block.id}
              isFlying={block.isFlying}
              onClick={() => handleBlockClick(block)}
            />
          )
        ))}
      </group>

      <OrbitControls makeDefault enablePan={false} minDistance={3} maxDistance={20} />
    </Canvas>
  );
}
