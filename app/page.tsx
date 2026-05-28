"use client";

import { useEffect, useState } from "react";

type Slot = {
  time_slot: string;
  remaining: number;
};

type TicketData = {
  nickname: string;
  group_size: number;
  time_slot: string;
  ticket_number: number;
  status: string;
};

export default function Page() {

  const [slots, setSlots] =
    useState<Slot[]>([]);

  const [loading, setLoading] =
    useState(true);

  // 予約モーダル
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

  // 整理券確認
  const [showCheckModal, setShowCheckModal] =
    useState(false);

  const [checkNickname, setCheckNickname] =
    useState("");

  const [ticketData, setTicketData] =
    useState<TicketData | null>(null);

  // GAS URL
  const GAS_URL =
    "https://script.google.com/macros/s/AKfycbxn9sbcd5f1nG9iU3R9qpmnJQN5QW3QmE_p3ANXuGayPqPnGamldHzeYSgBBNa4dkEG9w/exec";

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

  // 予約モーダル
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
              action: "reserve",
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

      if (
        result ===
        "NAME_EXISTS"
      ) {

        alert(
          "この名前は既に予約されています"
        );

        return;
      }

      if (
        result === "FULL"
      ) {

        alert("満席です");

        return;
      }

      if (
        result === "TOO_MANY"
      ) {

        alert(
          "1回の予約は4人までです"
        );

        return;
      }

      if (
        result !== "OK"
      ) {

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

  // 整理券確認
  const checkTicket = async () => {

    try {

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
              action: "check",
              nickname:
                checkNickname,
            }),
          }
        );

      const text =
        (await res.text()).trim();

      console.log(text);

      if (
        text === "NOT_FOUND"
      ) {

        alert(
          "予約が見つかりません"
        );

        return;
      }

      // JSONじゃない場合
      if (
        !text.startsWith("{")
      ) {

        alert(
          "取得失敗: " + text
        );

        return;
      }

      const data =
        JSON.parse(text);

      setTicketData(data);

    } catch (e) {

      console.error(e);

      alert("取得失敗");
    }
  };

  // キャンセル
  const cancelTicket = async () => {

    const ok =
      confirm(
        "本当にキャンセルしますか？"
      );

    if (!ok) return;

    try {

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
              action: "cancel",
              nickname:
                checkNickname,
            }),
          }
        );

      const result =
        (await res.text()).trim();

      if (
        result !== "OK"
      ) {

        alert(
          "キャンセル失敗"
        );

        return;
      }

      alert(
        "キャンセルしました"
      );

      setTicketData(null);

      setCheckNickname("");

      setShowCheckModal(false);

      loadSlots();

    } catch (e) {

      console.error(e);

      alert("通信失敗");
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

        {/* 確認ボタン */}
        <button
          onClick={() =>
            setShowCheckModal(true)
          }
          style={{
            width: "100%",
            background: "#111827",
            color: "white",
            border: "none",
            borderRadius: "16px",
            padding: "18px",
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "24px",
            cursor: "pointer",
          }}
        >
          整理券の確認・キャンセルはこちら
        </button>

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

        {/* 読み込み */}
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
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.1)",
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <div>

                <div
                  style={{
                    fontSize: "26px",
                    fontWeight: "bold",
                  }}
                >
                  {item.time_slot.slice(0, 5)}
                </div>

                <div
                  style={{
                    color: "#666",
                    marginTop: "6px",
                  }}
                >
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
                  padding: "14px 22px",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                予約
              </button>
            </div>
          ))
        )}
      </div>

      {/* 予約モーダル */}
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
            zIndex: 1000,
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
              {selectedTime.slice(0, 5)}
              {" "}
              の予約
            </h2>

            <input
              value={nickname}
              onChange={(e) =>
                setNickname(
                  e.target.value
                )
              }
              placeholder="ニックネーム"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border:
                  "1px solid #ccc",
                fontSize: "16px",
                boxSizing:
                  "border-box",
              }}
            />

            {/* 人数 */}
            <div
              style={{
                marginTop: "24px",
              }}
            >
              <div
                style={{
                  marginBottom: "12px",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                人数
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "16px",
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
                    width: "56px",
                    height: "56px",
                    borderRadius:
                      "999px",
                    border: "none",
                    background:
                      "#d1d5db",
                    fontSize: "32px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  -
                </button>

                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    minWidth: "50px",
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
                    width: "56px",
                    height: "56px",
                    borderRadius:
                      "999px",
                    border: "none",
                    background:
                      "#2563eb",
                    color: "white",
                    fontSize: "32px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  +
                </button>
              </div>

              <div
                style={{
                  marginTop: "12px",
                  color: "#666",
                  fontSize: "15px",
                }}
              >
                最大4人まで / 残り
                {" "}
                {remaining}
                {" "}
                人
              </div>
            </div>

            <button
              onClick={reserve}
              disabled={submitting}
              style={{
                width: "100%",
                marginTop: "24px",
                padding: "14px",
                background:
                  submitting
                    ? "#999"
                    : "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                cursor: submitting
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {submitting
                ? "予約中..."
                : "予約確定"}
            </button>
          </div>
        </div>
      )}

      {/* 整理券確認モーダル */}
      {showCheckModal && (

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
            zIndex: 1000,
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
              整理券確認
            </h2>

            <input
              value={checkNickname}
              onChange={(e) =>
                setCheckNickname(
                  e.target.value
                )
              }
              placeholder="ニックネーム"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border:
                  "1px solid #ccc",
                fontSize: "16px",
                boxSizing:
                  "border-box",
              }}
            />

            <button
              onClick={checkTicket}
              style={{
                width: "100%",
                marginTop: "16px",
                padding: "14px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              確認
            </button>

            {ticketData && (

              <div
                style={{
                  marginTop: "24px",
                  lineHeight: "2",
                }}
              >
                <div>
                  整理券番号:
                  {" "}
                  {ticketData.ticket_number}
                </div>

                <div>
                  時刻:
                  {" "}
                  {ticketData.time_slot}
                </div>

                <div>
                  人数:
                  {" "}
                  {ticketData.group_size}
                </div>

                <div>
                  状態:
                  {" "}
                  {ticketData.status}
                </div>

                <button
                  onClick={cancelTicket}
                  style={{
                    width: "100%",
                    marginTop: "20px",
                    padding: "14px",
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  キャンセル
                </button>
              </div>
            )}

            <button
              onClick={() => {

                setShowCheckModal(false);

                setTicketData(null);
              }}
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "14px",
                background: "#ddd",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
