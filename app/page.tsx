"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [slots, setSlots] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbzKiw27VfA2g-Zg8KZzm4WvqHOsod5aV0CWgKi2xZXh0gLvMhglDysx-1pL1yRwoHPnQA/exec")
      .then(res => res.json())
      .then(data => setSlots(data));
  }, []);

  const reserve = async (time: string) => {
    await fetch("GASのURL", {
      method: "POST",
      body: JSON.stringify({ time_slot: time }),
    });

    alert("予約しました");

    // 再読み込み（最新状態取得）
    location.reload();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>予約可能な時間</h1>

      {slots.length === 0 ? (
        <p>現在空きはありません</p>
      ) : (
        <ul>
          {slots.map((item, i) => (
            <li key={i}>
              {item.time_slot.slice(0, 5)}（残り{item.remaining}人）

              <button
                onClick={() => reserve(item.time_slot)}
                style={{ marginLeft: "10px" }}
              >
                予約
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
