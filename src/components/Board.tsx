"use client";
import React, { useState } from "react";

const playerCards = [
  { id: 1, name: "Blue-Eyes White Dragon", img: "/cards/blue-eyes.jpg" },
  { id: 2, name: "Dark Magician", img: "/cards/dark-magician.jpg" },
  { id: 3, name: "Red-Eyes Black Dragon", img: "/cards/red-eyes.jpg" },
];

const opponentCards = [
  { id: 4, name: "Summoned Skull", img: "/cards/summoned-skull.jpg" },
  { id: 5, name: "Celtic Guardian", img: "/cards/celtic-guardian.jpg" },
  { id: 6, name: "Kuriboh", img: "https://images.ygoprodeck.com/images/cards/40640057.jpg" }, // Example external
];

export default function Board() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div style={{ background: "#1a1a1a", minHeight: "100vh", padding: 24 }}>
      <h2 style={{ color: "#fff", textAlign: "center", marginBottom: 24 }}>Demo Yu-Gi-Oh! Board</h2>
      {/* Opponent row */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
        {opponentCards.map(card => (
          <img
            key={card.id}
            src={card.img}
            alt={card.name}
            title={card.name}
            style={{
              width: 120,
              margin: "0 18px",
              border: selected === card.id ? "4px solid #e94560" : "2px solid #333",
              borderRadius: 10,
              boxShadow: selected === card.id ? "0 0 12px #e94560" : "0 2px 6px #0007",
              cursor: "pointer",
              background: "#222"
            }}
            onClick={() => setSelected(card.id)}
          />
        ))}
      </div>
      {/* Player row */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        {playerCards.map(card => (
          <img
            key={card.id}
            src={card.img}
            alt={card.name}
            title={card.name}
            style={{
              width: 120,
              margin: "0 18px",
              border: selected === card.id ? "4px solid #43d9ad" : "2px solid #333",
              borderRadius: 10,
              boxShadow: selected === card.id ? "0 0 12px #43d9ad" : "0 2px 6px #0007",
              cursor: "pointer",
              background: "#222"
            }}
            onClick={() => setSelected(card.id)}
          />
        ))}
      </div>
    </div>
  );
}