"use client";

import { useEffect, useState } from "react";

type Slot = {
  time_slot: string;
  remaining: number;
};

export default function Page() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  // ← ここを自分のGAS URLに変更
  const GAS_URL =
    "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnQh_C1Cdud0qSMYVimg0tbWZgdQ60ylYFf2MfD8FglTMoisUb8f06Gm5ZlP9qHybFvilQEqsoyzRmVV1jK_oJvDOgqFna0OtxFV7ecPidJpcrh5rlAARalc5kxvBjpu3ZizdI1gMRggqohbEGeDC-Bcyf1UPs4aNHmWmUnGkZKZhWLqke8DRiWW6LayZdKH1B3PZ53BzTufUwZvzyxcBDbz_l1SHPvt2_q3LaiaHLUgbmnx-55K7m3dbTTHXMSP0PQLC2Mfj5qa3VdMpxOe2zx9CNaJAw&lib=MNyNcv_qMnCu0mlCuA1J48nJa9p4FWqyd";

  // 空き状況取得
  const loadSlots = async () => {
    try {
      setLoading(true);

      const res = await fetch(GAS_URL, {
        method: "GET",
      });

      const data = await res.json();

      console.log("取得データ:", data);

      if (Array.isArray(data)) {
        setSlots(data);
      } else {
        setSlots([]);
      }
    } catch (error) {
      console.error("取得失敗:", error);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  // 初回読み込み
  useEffect(() => {
    loadSlots();
  }, []);

  // 予約処理
  const reserve = async (time: string) => {
    const ok = confirm(`${time.slice(0, 5)} を予約しますか？`);

    if (!ok) return;

    try {
      const res = await fetch(GAS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          time_slot: time,
        }),
      });

      const result = await res.text();

      console.log(result);

      alert("予約完了！");

      // 最新状態再取得
      loadSlots();

    } catch (error) {
      console.error(error);
      alert("予約失敗");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          整理券予約
        </h1>

        {/* 読み込み中 */}
        {loading && (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "30px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            読み込み中...
          </div>
        )}

        {/* 空きなし */}
        {!loading && slots.length === 0 && (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "30px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            現在空きはありません
          </div>
        )}

        {/* 一覧 */}
        {!loading &&
          slots.map((item, index) => (
            <div
              key={index}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "20px",
                marginBottom: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  {item.time_slot.slice(0, 5)}
                </div>

                <div
                  style={{
                    color: "#666",
                    marginTop: "4px",
                  }}
                >
                  残り {item.remaining} 人
                </div>
              </div>

              <button
                onClick={() => reserve(item.time_slot)}
                style={{
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding: "12px 20px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                予約
              </button>
            </div>
          ))}
      </div>
    </main>
  );
}
