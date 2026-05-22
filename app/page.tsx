"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("GASのURL")
      .then((res) => res.json())
      .then((data) => {
        setSlots(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const reserve = async (time: string) => {
    const ok = confirm(`${time.slice(0, 5)} を予約しますか？`);

    if (!ok) return;

    try {
      await fetch("GASのURL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          time_slot: time,
        }),
      });

      alert("予約完了！");

      location.reload();

    } catch (e) {
      alert("予約失敗");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
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
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          整理券予約
        </h1>

        {loading ? (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "16px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            読み込み中...
          </div>
        ) : slots.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "16px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            現在空きはありません
          </div>
        ) : (
          slots.map((item, i) => (
            <div
              key={i}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "16px",
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
                  background: "#2563eb",
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
          ))
        )}
      </div>
    </main>
  );
}
