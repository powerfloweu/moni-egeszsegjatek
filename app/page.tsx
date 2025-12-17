"use client";

import { useEffect, useState } from "react";
import DiceCard from "../components/DiceCard";
import MonthlySummary from "../components/MonthlySummary";
import TodayEntry from "../components/TodayEntry";
import { getMonthId, getTodayDateString } from "../lib/date";
import { calculateStreak } from "../lib/streak";
import { AppState, DailyEntry, emptyState, loadAppState, saveAppState, upsertEntry } from "../lib/storage";

const HomePage = () => {
  const [state, setState] = useState<AppState>(emptyState());
  const [loaded, setLoaded] = useState(false);
  const [month, setMonth] = useState(getMonthId(new Date()));

  useEffect(() => {
    const initial = loadAppState();
    setState(initial);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveAppState(state);
  }, [state, loaded]);

  const today = getTodayDateString();
  const todayEntry = state.entriesByDate[today];
  const streak = calculateStreak(state.entriesByDate, today);

  const backgrounds = [
    "linear-gradient(135deg, #e0f4ff 0%, #dff7e3 50%, #f3ffe6 100%)",
    "linear-gradient(120deg, #d7f9f1 0%, #e8f7ff 55%, #f8fff4 100%)",
    "linear-gradient(145deg, #cbe6ff 0%, #e7fff3 60%, #fff8e6 100%)",
    "linear-gradient(160deg, #e5f9f2 0%, #e2f0ff 50%, #fff5ed 100%)",
    "linear-gradient(140deg, #dff7ff 0%, #e8ffec 55%, #fff3df 100%)",
    "linear-gradient(130deg, #d9f2ff 0%, #e6ffe8 60%, #fff6e5 100%)",
    "linear-gradient(150deg, #e4fff7 0%, #e0f1ff 55%, #fff1e0 100%)",
    "linear-gradient(135deg, #d8f5ff 0%, #e6ffef 60%, #fff4df 100%)",
    "linear-gradient(125deg, #e2f7ff 0%, #e4ffed 55%, #fff2e0 100%)",
    "linear-gradient(155deg, #ddf0ff 0%, #e8fff2 60%, #fff6e6 100%)",
  ];
  const bgIndex = new Date().getDate() % backgrounds.length;
  const dailyBackground = backgrounds[bgIndex];

  const handleRoll = (roll: number, activity: { id: string }) => {
    setState((prev) => {
      const existing = prev.entriesByDate[today];
      if (existing && existing.source === "manual") {
        const ok = window.confirm(
          "Már manuálisan rögzítettél ma. A dobás felülírja a mai adatokat. Folytatod?"
        );
        if (!ok) return prev;
      }

      return upsertEntry(prev, today, () => ({
        date: today,
        roll,
        activityId: activity.id,
        source: "roll",
        done: false,
        minutes: undefined,
        km: undefined,
        note: undefined,
        updatedAt: Date.now(),
      }));
    });
  };

  const handleUpdateToday = (updates: Partial<DailyEntry>) => {
    setState((prev) => {
      const current = prev.entriesByDate[today];
      if (!current) return prev;
      return upsertEntry(prev, today, () => ({
        ...current,
        ...updates,
      }));
    });
  };

  const handleImport = (next: AppState) => {
    setState(next);
    setLoaded(true);
    setMonth(getMonthId(new Date()));
  };

  return (
    <main className="page">
      <div className="container">
        <header className="hero">
          <div>
            <p className="eyebrow">Móni egészségjátéka</p>
            <h1>Mindennapi apró lépések</h1>
            <p className="muted">
              Dobj egyet a D20-szal, kapj egy 5-10 perces feladatot, jelöld készre és kövesd a haladást.
              Az adataid csak a böngésződben maradnak.
            </p>
          </div>
        </header>

        <div className="grid two-cols">
          <DiceCard todayEntry={todayEntry} onRoll={handleRoll} />
          <TodayEntry entry={todayEntry} streak={streak} onChange={handleUpdateToday} />
        </div>

        <MonthlySummary state={state} month={month} onMonthChange={setMonth} onImport={handleImport} />

        <footer className="footer">Adatok a böngésződben tárolódnak.</footer>
      </div>

      <style jsx global>{`
        :root {
          color: #0f172a;
          background: #f6f5ff;
          font-family: "Manrope", "Segoe UI", system-ui, -apple-system, sans-serif;
          --primary-1: #15803d;
          --primary-2: #22c55e;
          --accent: #16a34a;
          --pill-bg: #ecfdf3;
          --page-bg: ${dailyBackground};
        }
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          background: var(--page-bg);
          color: #0f172a;
        }
        .page {
          min-height: 100vh;
          padding: 32px 16px 64px;
        }
        .container {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .hero h1 {
          margin: 0 0 8px;
          font-size: 28px;
          letter-spacing: -0.01em;
        }
        .hero .muted {
          max-width: 720px;
        }
        .card {
          background: #ffffff;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 10px 40px rgba(15, 23, 42, 0.08);
          border: 1px solid rgba(15, 23, 42, 0.05);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .dice-card {
          text-align: center;
        }
        .dice-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        .dice-container {
          margin: 40px 0;
          display: flex;
          justify-content: center;
          perspective: 1200px;
        }
        .d20-dice {
          width: 240px;
          height: 280px;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-style: preserve-3d;
          position: relative;
        }
        .dice-image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dice-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 15px 40px rgba(21, 128, 61, 0.35)) drop-shadow(0 5px 15px rgba(13, 77, 40, 0.2));
        }
        .dice-number-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 62px;
          font-weight: 900;
          color: white;
          text-shadow: 0 3px 10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 255, 255, 0.1);
          font-family: system-ui, -apple-system, sans-serif;
          pointer-events: none;
          user-select: none;
        }
        .d20-dice:hover {
          transform: translateY(-12px) scale(1.08) rotateX(5deg);
        }
        .d20-dice.rolling {
          animation: diceRollAnimation 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes diceRollAnimation {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1); }
          20% { transform: rotateX(180deg) rotateY(180deg) rotateZ(90deg) scale(1.15); }
          40% { transform: rotateX(360deg) rotateY(360deg) rotateZ(180deg) scale(1.2); }
          60% { transform: rotateX(540deg) rotateY(540deg) rotateZ(270deg) scale(1.15); }
          80% { transform: rotateX(720deg) rotateY(720deg) rotateZ(360deg) scale(1.08); }
          100% { transform: rotateX(720deg) rotateY(720deg) rotateZ(360deg) scale(1); }
        }
        .dice-number {
          pointer-events: none;
          user-select: none;
          bottom: 10%;
          right: 10%;
          width: 30%;
          height: 30%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.3) 0%,
            transparent 70%
          );
          border-radius: 50%;
        }
        .result-box {
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          border: 2px solid var(--primary-2);
          border-radius: 16px;
          padding: 20px;
          margin: 16px 0;
          box-shadow: 0 4px 16px rgba(34, 197, 94, 0.15);
        }
        .result-box .activity-name {
          font-size: 24px;
          margin: 8px 0;
          color: var(--primary-1);
        }
        .dice-value {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--primary-1), var(--primary-2));
          color: #fff;
          display: grid;
          place-items: center;
          font-size: 24px;
          font-weight: 700;
          transition: transform 0.2s ease;
        }
        .dice-value.rolling {
          animation: diceRoll 0.6s ease-in-out;
        }
        @keyframes diceRoll {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.1); }
          50% { transform: rotate(180deg) scale(1.2); }
          75% { transform: rotate(270deg) scale(1.1); }
        }
        h1,
        h2,
        h3 {
          margin: 0;
        }
        .muted {
          color: #64748b;
          margin: 0;
          font-size: 14px;
        }
        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 12px;
          font-weight: 700;
          color: var(--accent);
          margin: 0 0 4px;
        }
        .streak {
          align-self: center;
          background: #fff7ed;
          color: #c2410c;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid #fed7aa;
          font-size: 12px;
        }
        .buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .btn {
          border: 1px solid rgba(15, 23, 42, 0.12);
          border-radius: 12px;
          background: #fff;
          padding: 10px 14px;
          cursor: pointer;
          font-weight: 600;
          transition: transform 120ms ease, box-shadow 120ms ease;
        }
        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.1);
        }
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }
        .btn.primary {
          background: linear-gradient(135deg, var(--primary-1), var(--primary-2));
          color: #fff;
          border: none;
        }
        .btn.secondary {
          background: #0f172a;
          color: #fff;
          border: none;
        }
        .btn.ghost {
          background: #f8fafc;
          border: 1px solid rgba(15, 23, 42, 0.06);
        }
        .grid {
          display: grid;
          gap: 16px;
        }
        .grid.two-cols {
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
        .activities-grid {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
        .pill {
          border: 1px dashed rgba(15, 23, 42, 0.1);
          border-radius: 12px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--pill-bg);
          min-height: 56px;
        }
        .pill-number {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #0f172a;
          color: #fff;
          display: grid;
          place-items: center;
          font-size: 12px;
          font-weight: 700;
        }
        .row {
          display: flex;
          align-items: center;
        }
        .row.gap {
          gap: 10px;
        }
        .row.wrap {
          flex-wrap: wrap;
        }
        .row.space-between {
          justify-content: space-between;
        }
        .stack {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .stack.grow {
          flex: 1;
        }
        .input,
        textarea,
        input[type="number"],
        input[type="text"],
        input[type="file"] {
          border-radius: 10px;
          border: 1px solid rgba(15, 23, 42, 0.12);
          padding: 10px 12px;
          font-size: 14px;
          width: 100%;
        }
        textarea {
          resize: vertical;
        }
        .result h3 {
          margin: 4px 0;
        }
        .success {
          background: #ecfdf3;
          border: 1px solid #bbf7d0;
          color: #166534;
          padding: 12px;
          border-radius: 12px;
          font-weight: 600;
        }
        .timer-section {
          margin-top: 8px;
          padding: 12px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
        }
        .timer-section label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 14px;
        }
        .timer-display {
          display: flex;
          justify-content: center;
          gap: 8px;
        }
        .timer-active {
          display: flex;
          align-items: center;
          gap: 12px;
          justify-content: center;
        }
        .timer-time {
          font-size: 32px;
          font-weight: 900;
          color: var(--primary-1);
          font-variant-numeric: tabular-nums;
          min-width: 100px;
          text-align: center;
        }
        .metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }
        .metric {
          padding: 12px;
          border: 1px solid rgba(15, 23, 42, 0.06);
          border-radius: 12px;
          background: #f8fafc;
        }
        .label {
          font-size: 13px;
          color: #64748b;
        }
        .value {
          font-size: 22px;
          font-weight: 800;
          margin: 4px 0;
        }
        .subsection h3 {
          margin: 0 0 8px;
        }
        .list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .list-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid rgba(15, 23, 42, 0.06);
          background: #fff;
          gap: 8px;
        }
        .table-wrapper {
          overflow-x: auto;
          border: 1px solid rgba(15, 23, 42, 0.06);
          border-radius: 12px;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          min-width: 640px;
        }
        .table th,
        .table td {
          text-align: left;
          padding: 10px;
          border-bottom: 1px solid rgba(15, 23, 42, 0.06);
          font-size: 14px;
        }
        .table th {
          background: #f8fafc;
          font-weight: 700;
        }
        .empty {
          padding: 16px;
          border: 1px dashed rgba(15, 23, 42, 0.2);
          border-radius: 12px;
          color: #475569;
          background: #f8fafc;
        }
        .table tr:last-child td {
          border-bottom: none;
        }
        .footer {
          text-align: center;
          color: #475569;
          font-size: 14px;
          padding: 16px;
        }
        @media (max-width: 640px) {
          .dice-value {
            width: 52px;
            height: 52px;
          }
          .table {
            min-width: 520px;
          }
          .activities-grid {
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          }
        }
      `}</style>
    </main>
  );
};

export default HomePage;
