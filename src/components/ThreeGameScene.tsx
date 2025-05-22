'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState } from 'react';
import Card3D from './Card3D';

const CARD_LIST = [
  { name: 'Kuriboh', img: '/cards/kuriboh.jpg', atk: 300, def: 200 },
  { name: 'Blue-Eyes White Dragon', img: '/cards/blue-eyes.jpg', atk: 3000, def: 2500 },
  { name: 'Dark Magician', img: '/cards/dark-magician.jpg', atk: 2500, def: 2100 },
  { name: 'Red-Eyes Black Meteor Dragon', img: '/cards/red-eyes.jpg', atk: 3500, def: 2000 },
  { name: 'Summoned Skull', img: '/cards/summoned-skull.jpg', atk: 2500, def: 1200 },
  { name: 'Obnoxious Celtic Guard', img: '/cards/celtic-guardian.jpg', atk: 1400, def: 1200 }
];

type CardState = {
  name: string;
  img: string;
  atk: number;
  def: number;
  pos: number;
  owner: 0 | 1;
  isFaceDown?: boolean;
};

const makePlayerCards = () =>
  CARD_LIST.map((card, i) => ({ ...card, pos: i, owner: 1 as const }));
const makeOpponentCards = () =>
  CARD_LIST.map((card, i) => ({ ...card, pos: i, owner: 0 as const }));

export default function ThreeGameScene() {
  const [turn, setTurn] = useState<0 | 1>(1);
  const [playerCards, setPlayerCards] = useState<CardState[]>(makePlayerCards());
  const [opponentCards, setOpponentCards] = useState<CardState[]>(makeOpponentCards());
  const [selected, setSelected] = useState<{ row: 0 | 1; idx: number } | null>(null);
  const [phase, setPhase] = useState<'main' | 'battle' | 'end'>('main');
  const [message, setMessage] = useState<string>('Your turn: Select a card.');

  function handleCardClick(row: 0 | 1, idx: number) {
    if (turn !== row) return;
    setSelected({ row, idx });
    setMessage(`Selected card: ${(row === 1 ? playerCards : opponentCards)[idx].name}`);
  }

  function rotateCard() {
    if (!selected || turn !== selected.row) return;
    if (selected.row === 1) {
      setPlayerCards(cs =>
        cs.map((c, i) =>
          i === selected.idx ? { ...c, isFaceDown: !c.isFaceDown } : c
        )
      );
      setMessage(`Rotated ${playerCards[selected.idx].name}`);
    }
  }

  function attack() {
    if (!selected || selected.row !== 1) return;
    const attacker = playerCards[selected.idx];
    const defender = opponentCards[selected.idx];
    if (!defender) {
      setMessage('No opponent card to attack.');
      return;
    }
    const result =
      attacker.atk > defender.atk
        ? 'destroyed opponent card!'
        : attacker.atk < defender.atk
        ? 'was destroyed!'
        : 'draw!';
    setMessage(`${attacker.name} attacked ${defender.name} and ${result}`);
  }

  function nextPhase() {
    if (phase === 'main') {
      setPhase('battle');
      setMessage('Battle Phase! Select a card and attack.');
    } else if (phase === 'battle') {
      setPhase('end');
      setMessage('End Phase! Passing turn.');
    } else {
      setTurn(t => (t === 1 ? 0 : 1));
      setPhase('main');
      setSelected(null);
      setMessage(turn === 1 ? "Opponent's turn." : "Your turn! Select a card.");
    }
  }

  const CARD_WIDTH = 2.5, CARD_GAP = 0.8, PLAYER_ROW_Z = 2.2, OPP_ROW_Z = -2.2;

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#222' }}>
      <div style={{ position: 'absolute', left: 20, top: 12, color: '#fff', zIndex: 10, fontSize: 15 }}>
        <b>{phase.toUpperCase()} — {turn === 1 ? "Player" : "Opponent"} Turn</b> |&nbsp;
        <span>{message}</span>
        <div style={{ marginTop: 6 }}>
          <button onClick={rotateCard} disabled={!selected || turn !== 1}>Rotate</button>
          <button onClick={attack} disabled={phase !== 'battle' || !selected || turn !== 1}>Attack</button>
          <button onClick={nextPhase}>Next Phase</button>
        </div>
      </div>
      <Canvas shadows camera={{ position: [0, 7, 13], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[0, 10, 10]} intensity={1} castShadow />
        <mesh position={[0, -2, 0]} receiveShadow>
          <boxGeometry args={[18, 1, 8]} />
          <meshStandardMaterial color="#4b2e12" />
        </mesh>
        {opponentCards.map((card, idx) => (
          <Card3D
            key={'opp-' + idx}
            position={[(idx - 2.5) * (CARD_WIDTH + CARD_GAP), 0, OPP_ROW_Z]}
            img={card.img}
            isSelected={selected?.row === 0 && selected.idx === idx}
            rotationY={Math.PI}
            onClick={() => handleCardClick(0, idx)}
            faceDown={!!card.isFaceDown}
            name={card.name}
          />
        ))}
        {playerCards.map((card, idx) => (
          <Card3D
            key={'player-' + idx}
            position={[(idx - 2.5) * (CARD_WIDTH + CARD_GAP), 0, PLAYER_ROW_Z]}
            img={card.img}
            isSelected={selected?.row === 1 && selected.idx === idx}
            rotationY={0}
            onClick={() => handleCardClick(1, idx)}
            faceDown={!!card.isFaceDown}
            name={card.name}
          />
        ))}
        <OrbitControls
          enablePan={false}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 3.1}
          maxDistance={18}
          minDistance={11}
        />
      </Canvas>
    </div>
  );
}