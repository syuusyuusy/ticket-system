"use client";

import { useEffect, useState } from "react";

type Slot = {
  time_slot: string;
  remaining: number;
};

export default function Page() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");

  const [nickname, setNickname] = useState("");
  const [groupSize, setGroupSize] = useState(1);

  const GAS_URL =
    "https://script.google.com/macros/s/AKfycbw4ljJo3oCxvzK62WXboP-Tf0031XQ5mSGNv9WIo8n2InTfrcJt_oZh8wAfIkxvyP5s/exec";

  const loadSlots = async () => {
    try {
      setLoading(true);

      const res = await fetch(GAS_URL);
      const data = await res.json();

      if (Array.isArray(data)) {
        setSlots(data);
      } else {
        setSlots([]);
      }

    } catch (e) {
      console.error(e);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  // モーダル開く
  const openReserveModal = (time: string) => {
    setSelectedTime(time);
    setNickname("");
    setGroupSize(1);
    setShowModal(true);
  };

  // 予約確定
  const reserve = async () => {
    if (!nickname.trim()) {
      alert("ニックネームを入力してください");
      return;
    }

    try {
      await fetch("/api/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          time_slot: selectedTime,
          nickname,
          group_size: groupSize,
        }),
      });

      alert("予約完了！");

      setShowModal(false);

      loadSlots();

    } catch (e) {
      console.error(e);
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
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          整理券予約
        </h1>

        {loading ? (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "30px",
              textAlign: "center",
            }}
          >
            読み込み中...
          </div>
        ) : slots.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "30px",
              textAlign: "center",
            }}
          >
            現在空きはありません
          </div>
        ) : (
          slots.map((item, index) => (
            <div
              key={index}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "20px",
                marginBottom: "16px",
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
                  }}
                >
                  残り {item.remaining} 人
                </div>
              </div>

              <button
                onClick={() => openReserveModal(item.time_slot)}
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding: "12px 20px",
                  cursor: "pointer",
                }}
              >
                予約
              </button>
            </div>
          ))
        )}
      </div>

      {/* モーダル */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "24px",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                marginBottom: "20px",
              }}
            >
              {selectedTime.slice(0, 5)} の予約
            </h2>

            {/* ニックネーム */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ marginBottom: "8px" }}>
                ニックネーム
              </div>

              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="名前を入力"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* 人数 */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ marginBottom: "8px" }}>
                人数
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <button
                  onClick={() =>
                    setGroupSize(Math.max(1, groupSize - 1))
                  }
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "999px",
                    border: "none",
                    background: "#ddd",
                    fontSize: "24px",
                  }}
                >
                  -
                </button>

                <div
                  style={{
                    fontSize: "24px",
                    minWidth: "40px",
                    textAlign: "center",
                  }}
                >
                  {groupSize}
                </div>

                <button
                  onClick={() => setGroupSize(groupSize + 1)}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "999px",
                    border: "none",
                    background: "#2563eb",
                    color: "white",
                    fontSize: "24px",
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* ボタン */}
            <div
              style={{
                display: "flex",
                gap: "12px",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#ddd",
                }}
              >
                キャンセル
              </button>

              <button
                onClick={reserve}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#2563eb",
                  color: "white",
                }}
              >
                予約確定
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
