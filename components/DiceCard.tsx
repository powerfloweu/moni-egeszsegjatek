"use client";

import React, { useMemo } from "react";
import { Activity, activities, activitiesById, getActivityForRoll } from "../lib/activities";
import { DailyEntry } from "../lib/storage";

type DiceCardProps = {
  todayEntry?: DailyEntry;
  onRoll: (roll: number, activity: Activity) => void;
};

const DiceCard = ({ todayEntry, onRoll }: DiceCardProps) => {
  const [isRolling, setIsRolling] = React.useState(false);

  const currentActivity = useMemo(() => {
    if (!todayEntry) return undefined;
    if (todayEntry.source === "manual") {
      return activitiesById[todayEntry.activityId];
    }
    if (typeof todayEntry.roll === "number") {
      return getActivityForRoll(todayEntry.roll);
    }
    return undefined;
  }, [todayEntry]);

  const attemptRoll = () => {
    if (todayEntry) {
      const ok = window.confirm(
        "Már van mai feladat. Újradobás felülírja a mai adatokat is. Folytatod?"
      );
      if (!ok) return;
    }
    setIsRolling(true);
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 20) + 1;
      const activity = getActivityForRoll(roll);
      onRoll(roll, activity);
      setIsRolling(false);
    }, 600);
  };

  return (
    <section className="card dice-card">
      <div className="dice-section">
        <div className="eyebrow">🎲 Véletlen választás</div>
        <h2>20 oldalú kocka</h2>
        <p className="muted">Kattints a gombra a mai feladat kiválasztásához</p>
        
        <div className="dice-container">
          <div className={`d20-dice ${isRolling ? 'rolling' : ''}`}>
            <svg viewBox="0 0 240 280" className="dice-svg" preserveAspectRatio="xMidYMid meet">
              <defs>
                {/* Gradients for different face angles */}
                <linearGradient id="topGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="50%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
                <linearGradient id="midGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
                <linearGradient id="darkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#15803d" />
                  <stop offset="100%" stopColor="#0d4d28" />
                </linearGradient>
                
                {/* Lighting effects */}
                <filter id="diceShine">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
                  <feOffset dx="2" dy="4" result="offsetblur"/>
                  <feFlood floodColor="#ffffff" floodOpacity="0.4" result="offsetcolor"/>
                  <feComposite in="offsetcolor" in2="offsetblur" operator="in" result="offsetblur"/>
                  <feComposite in="offsetblur" in2="SourceAlpha" operator="in" result="offsetblur"/>
                  <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id="diceShadow">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="5"/>
                  <feOffset dx="3" dy="8" result="offsetblur"/>
                  <feFlood floodColor="#000000" floodOpacity="0.4" result="offsetcolor"/>
                  <feComposite in="offsetcolor" in2="offsetblur" operator="in" result="offsetblur"/>
                  <feComposite in="offsetblur" in2="SourceAlpha" operator="in" result="offsetblur"/>
                  <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Drop shadow */}
              <ellipse cx="120" cy="260" rx="80" ry="12" fill="#000000" opacity="0.15"/>
              
              {/* D20 Icosahedron - 3D perspective view */}
              <g filter="url(#diceShadow)">
                {/* Top point - triangle faces */}
                <polygon points="120,20 80,60 100,50" fill="#4ade80" stroke="#0d4d28" strokeWidth="1.5" strokeLinejoin="round"/>
                <polygon points="120,20 160,60 140,50" fill="#4ade80" stroke="#0d4d28" strokeWidth="1.5" strokeLinejoin="round"/>
                <polygon points="120,20 100,50 140,50" fill="#5eef8f" stroke="#0d4d28" strokeWidth="1.5" strokeLinejoin="round"/>
                
                {/* Upper band - 5 faces */}
                <polygon points="80,60 50,90 70,95" fill="url(#topGradient)" stroke="#0d4d28" strokeWidth="1.5" strokeLinejoin="round"/>
                <polygon points="160,60 190,90 170,95" fill="url(#midGradient)" stroke="#0d4d28" strokeWidth="1.5" strokeLinejoin="round"/>
                <polygon points="80,60 100,50 120,75 100,85" fill="#22c55e" stroke="#0d4d28" strokeWidth="1.5" strokeLinejoin="round"/>
                <polygon points="160,60 140,50 120,75 140,85" fill="#22c55e" stroke="#0d4d28" strokeWidth="1.5" strokeLinejoin="round"/>
                <polygon points="100,50 140,50 130,80 110,80" fill="#2dd36f" stroke="#0d4d28" strokeWidth="1.5" strokeLinejoin="round"/>
                
                {/* Middle band - central faces (main display area) */}
                <polygon points="50,90 30,130 60,135" fill="url(#darkGradient)" stroke="#0d4d28" strokeWidth="1.5" strokeLinejoin="round"/>
                <polygon points="70,95 60,120 100,130 90,105" fill="#16a34a" stroke="#0d4d28" strokeWidth="1.5" strokeLinejoin="round"/>
                <polygon points="100,85 110,80 130,80 120,75 120,100" fill="#22c55e" stroke="#0d4d28" strokeWidth="1.5" strokeLinejoin="round"/>
                <polygon points="140,85 120,100 150,115 160,100" fill="#22c55e" stroke="#0d4d28" strokeWidth="1.5" strokeLinejoin="round"/>
                <polygon points="170,95 180,120 140,130 150,105" fill="#16a34a" stroke="#0d4d28" strokeWidth="1.5" strokeLinejoin="round"/>
                <polygon points="190,90 210,130 180,135" fill="url(#darkGradient)" stroke="#0d4d28" strokeWidth="1.5" strokeLinejoin="round"/>
                
                {/* Center face - PRIMARY DISPLAY */}
                <polygon points="90,105 100,130 130,130 120,100" fill="#1ea853" stroke="#0d4d28" strokeWidth="2.5" strokeLinejoin="round"/>
                
                {/* Lower band */}
                <polygon points="60,135 80,160 100,160 90,140" fill="#15803d" stroke="#0d4d28" strokeWidth="1.5" strokeLinejoin="round"/>
                <polygon points="180,135 160,160 140,160 150,140" fill="#15803d" stroke="#0d4d28" strokeWidth="1.5" strokeLinejoin="round"/>
                <polygon points="30,130 40,160 50,165 60,135" fill="#0d4d28" stroke="#0d4d28" strokeWidth="1.5" strokeLinejoin="round"/>
                <polygon points="210,130 200,160 190,165 180,135" fill="#0d4d28" stroke="#0d4d28" strokeWidth="1.5" strokeLinejoin="round"/>
                
                {/* Bottom point area */}
                <polygon points="80,160 100,160 90,185" fill="#0d4d28" stroke="#0d4d28" strokeWidth="1.5" strokeLinejoin="round"/>
                <polygon points="160,160 140,160 150,185" fill="#0d4d28" stroke="#0d4d28" strokeWidth="1.5" strokeLinejoin="round"/>
                <polygon points="90,185 120,210 110,190" fill="#0a3a1f" stroke="#051d0f" strokeWidth="1.5" strokeLinejoin="round"/>
                <polygon points="150,185 120,210 130,190" fill="#0a3a1f" stroke="#051d0f" strokeWidth="1.5" strokeLinejoin="round"/>
                <polygon points="120,210 90,230 120,240 150,230" fill="#051d0f" stroke="#051d0f" strokeWidth="1.5" strokeLinejoin="round"/>
              </g>
              
              {/* Highlight shine effect on top */}
              <ellipse cx="110" cy="55" rx="15" ry="10" fill="white" opacity="0.25" filter="url(#diceShine)"/>
              
              {/* Main number display */}
              <text 
                x="110" 
                y="135" 
                textAnchor="middle" 
                className="dice-number" 
                fill="white" 
                fontSize="62" 
                fontWeight="900"
                style={{
                  textShadow: '0 3px 10px rgba(0,0,0,0.6), 0 0 20px rgba(255,255,255,0.1)',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                {isRolling ? "?" : (todayEntry?.source === "manual" ? "—" : todayEntry?.roll ?? "?")}
              </text>
            </svg>
          </div>
        </div>

        <div className="buttons">
          <button className="btn primary" onClick={attemptRoll} disabled={isRolling}>
            {todayEntry ? "Újradobás" : "Dobás"}
          </button>
        </div>
      </div>

      {todayEntry && (
        <div className="result-box">
          <div className="eyebrow">
            {todayEntry.source === "manual"
              ? "Mást csináltam"
              : `Dobás eredménye: ${todayEntry.roll}`}
          </div>
          <h3 className="activity-name">{currentActivity?.name}</h3>
          <p className="muted">{currentActivity?.description}</p>
        </div>
      )}

      <div className="grid activities-grid">
        {activities.map((activity, index) => (
          <div key={activity.id} className="pill">
            <span className="pill-number">{index + 1}</span>
            <span>{activity.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DiceCard;
