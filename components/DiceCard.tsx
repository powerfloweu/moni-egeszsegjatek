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
            <svg viewBox="0 0 200 200" className="dice-svg">
              <defs>
                <linearGradient id="diceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="50%" stopColor="#16a34a" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
                <filter id="diceShadow">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                  <feOffset dx="0" dy="4" result="offsetblur"/>
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3"/>
                  </feComponentTransfer>
                  <feMerge> 
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/> 
                  </feMerge>
                </filter>
              </defs>
              
              {/* Icosahedron faces - simplified visible front faces */}
              <g className="dice-faces" filter="url(#diceShadow)">
                {/* Top pyramid faces */}
                <polygon points="100,30 60,70 140,70" fill="url(#diceGradient)" stroke="#0f5f2f" strokeWidth="1.5" opacity="0.95"/>
                <polygon points="100,30 140,70 160,90" fill="#16a34a" stroke="#0f5f2f" strokeWidth="1.5" opacity="0.9"/>
                <polygon points="100,30 40,90 60,70" fill="#16a34a" stroke="#0f5f2f" strokeWidth="1.5" opacity="0.9"/>
                
                {/* Middle belt faces */}
                <polygon points="60,70 40,90 70,110" fill="#15803d" stroke="#0f5f2f" strokeWidth="1.5" opacity="0.85"/>
                <polygon points="140,70 160,90 130,110" fill="#15803d" stroke="#0f5f2f" strokeWidth="1.5" opacity="0.85"/>
                <polygon points="60,70 70,110 100,100" fill="#22c55e" stroke="#0f5f2f" strokeWidth="1.5" opacity="0.95"/>
                <polygon points="140,70 100,100 130,110" fill="#22c55e" stroke="#0f5f2f" strokeWidth="1.5" opacity="0.95"/>
                
                {/* Center face - main display */}
                <polygon points="100,100 70,110 100,140 130,110" fill="#16a34a" stroke="#0f5f2f" strokeWidth="2" opacity="1"/>
                
                {/* Bottom faces */}
                <polygon points="70,110 40,130 100,140" fill="#15803d" stroke="#0f5f2f" strokeWidth="1.5" opacity="0.8"/>
                <polygon points="130,110 160,130 100,140" fill="#15803d" stroke="#0f5f2f" strokeWidth="1.5" opacity="0.8"/>
                <polygon points="100,140 40,130 100,170" fill="#0d4d28" stroke="#0f5f2f" strokeWidth="1.5" opacity="0.75"/>
                <polygon points="100,140 160,130 100,170" fill="#0d4d28" stroke="#0f5f2f" strokeWidth="1.5" opacity="0.75"/>
              </g>
              
              {/* Number display */}
              <text x="100" y="125" textAnchor="middle" className="dice-number" fill="white" fontSize="48" fontWeight="900" style={{textShadow: '0 2px 8px rgba(0,0,0,0.5)'}}>
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
