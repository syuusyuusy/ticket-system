
"use client";

import { useEffect, useState } from "react";

type Slot = {
  time_slot: string;
  remaining: number;
};

export default function Page() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  const GAS_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AWDtjMXpdElqKgbdNq7C5SiSr46KUpN80i6bSgwKcI3awqmjieOA0hSNABXUnnE_sS0qRG5rWIreczdmP6NHIFln5lCxR0uXO1uHbkNAjQH1fOFBYhgsTdu1ftqWgUQ1ShyC3PeLuT7nGZExAi8L_N1h3PGdwrHsH2wDlmmNlNOc9i-pKv2yPxZgW28-EPhn691Pfk2Ppi92xCB8T5HIQhHEWRm2u8oLGVr_4ovjeCyFCHlMi0V9GfDgbp0Lha13WhH1oMfJ-iLyrhTIGLs2CLwsgfyRNYLG3Q&lib=MNyNcv_qMnCu0mlCuA1J48nJa9p4FWqyd";

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