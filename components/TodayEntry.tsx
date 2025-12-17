"use client";

import { useEffect, useMemo, useState } from "react";
import { activities, activitiesById } from "../lib/activities";
import { DailyEntry } from "../lib/storage";

type TodayEntryProps = {
  entry?: DailyEntry;
  streak: number;
  onChange: (updates: Partial<DailyEntry>) => void;
};

const TodayEntry = ({ entry, streak, onChange }: TodayEntryProps) => {
  const [manualMode, setManualMode] = useState(entry?.source === "manual");
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // keep manual toggle in sync when entry changes
  useEffect(() => {
    setManualMode(entry?.source === "manual");
  }, [entry]);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            // Play a simple beep or notification
            if (typeof window !== 'undefined') {
              window.alert('⏰ Lejárt az idő!');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const activityName = useMemo(() => {
    if (!entry) return undefined;
    return activitiesById[entry.activityId]?.name ?? "Ismeretlen aktivitás";
  }, [entry]);

  const handleNumberChange = (value: string, key: "minutes" | "km") => {
    if (!entry) return;
    if (value === "") {
      onChange({ [key]: undefined });
      return;
    }
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.min(999, Math.max(0, parsed));
    onChange({ [key]: clamped });
  };

  const handleQuickAdd = (delta: number) => {
    if (!entry) return;
    const current = entry.minutes ?? 0;
    const next = Math.min(999, current + delta);
    onChange({ minutes: next });
  };

  const switchMode = (nextManual: boolean) => {
    if (!entry && nextManual) {
      // Create manual with defaults
      onChange({
        source: "manual",
        roll: undefined,
        activityId: activities[0].id,
        done: false,
        minutes: undefined,
        km: undefined,
        note: undefined,
      });
      setManualMode(true);
      return;
    }

    if (!entry) return;

    const ok = window.confirm(
      "Ez felülírja a mai feladatot és a mai adatokat. Biztos?"
    );
    if (!ok) return;

    if (nextManual) {
      onChange({
        source: "manual",
        roll: undefined,
        activityId: activities[0].id,
        done: false,
        minutes: undefined,
        km: undefined,
        note: undefined,
      });
      setManualMode(true);
    } else {
      // Turn off manual: clear today entry, allow fresh roll
      onChange({
        source: undefined as any,
        roll: undefined,
        activityId: undefined as any,
        done: false,
        minutes: undefined,
        km: undefined,
        note: undefined,
      });
      setManualMode(false);
    }
  };

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <div className="eyebrow">Mai feladat</div>
          <h2>{activityName ?? "Válassz dobással"}</h2>
        </div>
        <div className="eyebrow streak">🔥 Következetesség: {streak} nap</div>
      </div>

      <div className="row gap" style={{ alignItems: "center" }}>
        <label className="row gap">
          <input
            type="checkbox"
            checked={manualMode}
            onChange={(e) => switchMode(e.target.checked)}
          />
          <span>Mást csináltam</span>
        </label>
      </div>

      {!entry ? (
        <p className="muted">Dobj egyet vagy kapcsold be a "Mást csináltam" opciót a kezdéshez.</p>
      ) : (
        <div className="stack">
          {manualMode && (
            <label className="stack">
              <span className="muted">Mit csináltál?</span>
              <select
                className="input"
                value={entry.activityId}
                onChange={(e) =>
                  onChange({
                    source: "manual",
                    roll: undefined,
                    activityId: e.target.value,
                  })
                }
              >
                {activities.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="row space-between">
            <span>Kész (done)</span>
            <input
              type="checkbox"
              checked={entry.done}
              onChange={(e) => onChange({ done: e.target.checked })}
            />
          </label>

          <div className="row gap">
            <label className="stack grow">
              <span className="muted">Perc</span>
              <input
                type="number"
                min={0}
                max={999}
                value={entry.minutes ?? ""}
                onChange={(e) => handleNumberChange(e.target.value, "minutes")}
                className="input"
              />
            </label>
            <label className="stack">
              <span className="muted">Km (opcionális)</span>
              <input
                type="number"
                min={0}
                max={999}
                value={entry.km ?? ""}
                onChange={(e) => handleNumberChange(e.target.value, "km")}
                className="input"
              />
            </label>
          </div>

          <div className="row gap">
            <button className="btn ghost" onClick={() => handleQuickAdd(5)} disabled={!entry}>
              +5 perc
            </button>
            <button className="btn ghost" onClick={() => handleQuickAdd(10)} disabled={!entry}>
              +10 perc
            </button>
          </div>

          <div className="timer-section">
            <label className="muted">Időzítő</label>
            <div className="timer-display">
              {timerActive ? (
                <div className="timer-active">
                  <span className="timer-time">{Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}</span>
                  <button className="btn ghost" onClick={() => { setTimerActive(false); setTimerSeconds(0); }}>Leállítás</button>
                </div>
              ) : (
                <div className="row gap">
                  <button className="btn secondary" onClick={() => { setTimerSeconds(5 * 60); setTimerActive(true); }}>5 perc</button>
                  <button className="btn secondary" onClick={() => { setTimerSeconds(10 * 60); setTimerActive(true); }}>10 perc</button>
                </div>
              )}
            </div>
          </div>

          <label className="stack">
            <span className="muted">Megjegyzés (opcionális)</span>
            <textarea
              value={entry.note ?? ""}
              onChange={(e) => onChange({ note: e.target.value })}
              rows={3}
              className="input"
              placeholder="Rövid jegyzet a napról..."
            />
          </label>

          {entry.done && (
            <div className="success">
              Nagyon király vagy, kedves Móni, ma is tettél valamit az egészségedért!
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default TodayEntry;
