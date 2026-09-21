export const levels = [
  // Level 1: Simple 3D cross
  [
    { id: 0, x: 0, y: 0, z: 1, dir: 'forward' },
    { id: 1, x: 0, y: 0, z: -1, dir: 'backward' },
    { id: 2, x: 1, y: 0, z: 0, dir: 'right' },
    { id: 3, x: -1, y: 0, z: 0, dir: 'left' },
    { id: 4, x: 0, y: 1, z: 0, dir: 'up' },
    { id: 5, x: 0, y: -1, z: 0, dir: 'down' },
    { id: 6, x: 0, y: 0, z: 0, dir: 'up' } // core blocked by top one initially
  ],
  // Level 2: 2x2x2 cube
  [
    { id: 0, x: 0, y: 0, z: 0, dir: 'left' },
    { id: 1, x: 1, y: 0, z: 0, dir: 'right' },
    { id: 2, x: 0, y: 1, z: 0, dir: 'up' },
    { id: 3, x: 1, y: 1, z: 0, dir: 'right' },
    { id: 4, x: 0, y: 0, z: 1, dir: 'forward' },
    { id: 5, x: 1, y: 0, z: 1, dir: 'down' },
    { id: 6, x: 0, y: 1, z: 1, dir: 'left' },
    { id: 7, x: 1, y: 1, z: 1, dir: 'up' }
  ],
  // Level 3: 3x3 plane with overlapping locks
  [
    { id: 0, x: -1, y: 0, z: -1, dir: 'left' },
    { id: 1, x: 0, y: 0, z: -1, dir: 'up' },
    { id: 2, x: 1, y: 0, z: -1, dir: 'right' },
    { id: 3, x: -1, y: 0, z: 0, dir: 'forward' },
    { id: 4, x: 0, y: 0, z: 0, dir: 'down' },
    { id: 5, x: 1, y: 0, z: 0, dir: 'backward' },
    { id: 6, x: -1, y: 0, z: 1, dir: 'left' },
    { id: 7, x: 0, y: 0, z: 1, dir: 'down' },
    { id: 8, x: 1, y: 0, z: 1, dir: 'right' },
    { id: 9, x: 0, y: 1, z: 0, dir: 'up' } // Cap on top
  ]
];
