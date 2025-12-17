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
            <div className="dice-image-wrapper">
              <img 
                src="/d20.png" 
                alt="D20 kocka" 
                className="dice-image"
              />
              <div className="dice-number-overlay">
                {isRolling ? "?" : (todayEntry?.source === "manual" ? "—" : todayEntry?.roll ?? "?")}
              </div>
            </div>
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
