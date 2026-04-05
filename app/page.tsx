
"use client";

import { useEffect, useState } from "react";

type Slot = {
  time_slot: string;
  remaining: number;
};

export default function Page() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  const GAS_URL = "https://script.google.com/macros/s/XXXXX/exec";

  const fetchSlots = async () => {
    try {
      const res = await fetch(GAS_URL);
      const data = await res.json();
      setSlots(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    const interval = setInterval(fetchSlots, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>読み込み中...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>予約可能な時間</h1>

      {slots.length === 0 && <p>現在空きはありません</p>}

      <ul>
        {slots.map((slot, index) => (
          <li key={index}>
            {slot.time_slot}（残り {slot.remaining} 人）
          </li>
        ))}
      </ul>
    </div>
  );
}