"use client";

import { useEffect, useState } from "react";

type Slot = {
  time_slot: string;
  remaining: number;
};

export default function Page() {

  const [slots, setSlots] =
    useState<Slot[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [selectedTime, setSelectedTime] =
    useState("");

  const [remaining, setRemaining] =
    useState(0);

  const [nickname, setNickname] =
    useState("");

  const [groupSize, setGroupSize] =
    useState(1);

  const [submitting, setSubmitting] =
    useState(false);

  // GAS URL
  const GAS_URL =
    "https://script.google.com/macros/s/AKfycby_CYCOok9ozm2Kg_bGoCi1NneqrX1Wfw2CkXZaTwymRqPwCDf27AImxPN3bAL_UzUOEA/exec";

  // 空き取得
  const loadSlots = async () => {

    try {

      setLoading(true);

      const res =
        await fetch(GAS_URL);

      const data =
        await res.json();

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
  const openReserveModal = (
    time: string,
    remain: number
  ) => {

    setSelectedTime(time);

    setRemaining(remain);

    setNickname("");

    setGroupSize(1);

    setShowModal(true);
  };

  // 予約
  const reserve = async () => {

    if (submitting) return;

    if (!nickname.trim()) {

      alert(
        "ニックネームを入力してください"
      );

      return;
    }

    if (groupSize > 4) {

      alert(
        "4人までです"
      );

      return;
    }

    if (groupSize > remaining) {

      alert(
        "残り人数を超えています"
      );

      return;
    }

    try {

      setSubmitting(true);

      const res =
        await fetch(
          "/api/reserve",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              time_slot:
                selectedTime,
              nickname,
              group_size:
                groupSize,
            }),
          }
        );

      const result =
        (await res.text()).trim();

      console.log(result);

      // 重複
      if (
        result ===
        "NAME_EXISTS"
      ) {

        alert(
          "この名前は既に予約されています"
        );

        return;
      }

      // 満席
      if (result === "FULL") {

        alert("満席です");

        return;
      }

      // CLOSED
      if (
        result === "CLOSED"
      ) {

        alert(
          "受付終了しています"
        );

        return;
      }

      // 人数超過
      if (
        result === "TOO_MANY"
      ) {

        alert(
          "4人までです"
        );

        return;
      }

      // その他
      if (result !== "OK") {

        alert(
          "予約失敗: " + result
        );

        return;
      }

      alert("予約完了！");

      setShowModal(false);

      loadSlots();

    } catch (e) {

      console.error(e);

      alert("通信失敗");

    } finally {

      setSubmitting(false);
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
                justifyContent:
                  "space-between",
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
                  {item.time_slot.slice(
                    0,
                    5
                  )}
                </div>

                <div>
                  残り
                  {" "}
                  {item.remaining}
                  {" "}
                  人
                </div>

              </div>

              <button
                onClick={() =>
                  openReserveModal(
                    item.time_slot,
                    item.remaining
                  )
                }
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding:
                    "12px 20px",
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
            background:
              "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent:
              "center",
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
              {selectedTime.slice(
                0,
                5
              )}
              {" "}
              の予約
            </h2>

            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  marginBottom: "8px",
                }}
              >
                ニックネーム
              </div>

              <input
                value={nickname}
                onChange={(e) =>
                  setNickname(
                    e.target.value
                  )
                }
                placeholder="名前を入力"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius:
                    "10px",
                  border:
                    "1px solid #ccc",
                }}
              />
            </div>

            <div
              style={{
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  marginBottom: "8px",
                }}
              >
                人数
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "12px",
                }}
              >
                <button
                  onClick={() =>
                    setGroupSize(
                      Math.max(
                        1,
                        groupSize - 1
                      )
                    )
                  }
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius:
                      "999px",
                    border: "none",
                  }}
                >
                  -
                </button>

                <div
                  style={{
                    fontSize: "24px",
                    minWidth: "40px",
                    textAlign:
                      "center",
                  }}
                >
                  {groupSize}
                </div>

                <button
                  onClick={() => {

                    if (
                      groupSize < 4 &&
                      groupSize <
                        remaining
                    ) {

                      setGroupSize(
                        groupSize + 1
                      );
                    }
                  }}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius:
                      "999px",
                    border: "none",
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
              }}
            >
              <button
                onClick={() =>
                  setShowModal(false)
                }
                disabled={submitting}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius:
                    "12px",
                  border: "none",
                }}
              >
                キャンセル
              </button>

              <button
                onClick={reserve}
                disabled={submitting}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius:
                    "12px",
                  border: "none",
                  background:
                    submitting
                      ? "#999"
                      : "#2563eb",
                  color: "white",
                }}
              >
                {submitting
                  ? "予約中..."
                  : "予約確定"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
