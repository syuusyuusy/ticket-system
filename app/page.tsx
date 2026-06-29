"use client";

import { useEffect, useState } from "react";

type Slot = {
  time_slot: string;
  remaining: number;
};

type Ticket = {
  nickname: string;
  group_size: number;
  time_slot: string;
  ticket_number: string;
  status: string;
};

export default function Page() {

  const [slots, setSlots] =
    useState<Slot[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [showCheckModal, setShowCheckModal] =
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

  const [checking, setChecking] =
    useState(false);

  const [canceling, setCanceling] =
    useState(false);

  const [ticketNickname, setTicketNickname] =
    useState("");

  const [ticket, setTicket] =
    useState<Ticket | null>(null);

  // GAS URL
  const GAS_URL =
    "https://script.google.com/macros/s/AKfycbwULF0fpoWAjGlubEem8beeP8ViozQ2YWGhNNj5b61ACAhA7OhwmNvxGWJ4Yuj3eRUQ7Q/exec";

  // 空き状況取得
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

  // モーダルを開く
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
        "1回の予約は4人までです"
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
              action: "reserve",
              time_slot:
                selectedTime,
              nickname,
              group_size:
                groupSize,
            }),
          }
        );

      const text =
        await res.text();

      if (text === "OK") {

        alert(
          "予約完了！"
        );

        setShowModal(false);

        loadSlots();

      } else if (
        text === "NAME_EXISTS"
      ) {

        alert(
          "そのニックネームは既に予約されています"
        );

      } else if (
        text === "FULL"
      ) {

        alert(
          "満席です"
        );

      } else {

        alert(
          "予約失敗: " + text
        );
      }

    } catch (e) {

      console.error(e);

      alert(
        "予約失敗"
      );

    } finally {

      setSubmitting(false);
    }
  };

  // 整理券確認
  const checkTicket = async () => {

    if (checking) return;

    if (!ticketNickname.trim()) {

      alert(
        "ニックネームを入力してください"
      );

      return;
    }

    try {

      setChecking(true);

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
                ticketNickname,
            }),
          }
        );

      const text =
        await res.text();

      if (
        text === "NOT_FOUND"
      ) {

        alert(
          "整理券が見つかりません"
        );

        setTicket(null);

        return;
      }

      const data =
        JSON.parse(text);

      setTicket(data);

    } catch (e) {

      console.error(e);

      alert(
        "取得失敗"
      );

    } finally {

      setChecking(false);
    }
  };

  // キャンセル
  const cancelTicket = async () => {

    if (canceling) return;

    if (
      !confirm(
        "本当にキャンセルしますか？"
      )
    ) {
      return;
    }

    try {

      setCanceling(true);

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
                ticketNickname,
            }),
          }
        );

      const text =
        await res.text();

      if (text === "OK") {

        alert(
          "キャンセルしました"
        );

        setTicket(null);

        loadSlots();

      } else {

        alert(
          "キャンセル失敗"
        );
      }

    } catch (e) {

      console.error(e);

      alert(
        "キャンセル失敗"
      );

    } finally {

      setCanceling(false);
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
            marginBottom: "20px",
          }}
        >
          整理券予約
        </h1>

        {/* 整理券確認 */}
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
            marginBottom: "24px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          整理券の確認・キャンセルはこちら
        </button>

        {/* 読み込み中 */}
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
                alignItems:
                  "center",
              }}
            >

              <div>

                <div
                  style={{
                    fontSize: "24px",
                    fontWeight:
                      "bold",
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
                onClick={() =>
                  openReserveModal(
                    item.time_slot,
                    item.remaining
                  )
                }
                style={{
                  background:
                    "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius:
                    "12px",
                  padding:
                    "14px 22px",
                  fontSize: "18px",
                  cursor: "pointer",
                  fontWeight:
                    "bold",
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
            alignItems:
              "center",
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
                marginBottom:
                  "20px",
              }}
            >
              {selectedTime.slice(0, 5)}
              の予約
            </h2>

            {/* 名前 */}
            <div
              style={{
                marginBottom:
                  "20px",
              }}
            >

              <div
                style={{
                  marginBottom:
                    "8px",
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
                  padding: "14px",
                  borderRadius:
                    "12px",
                  border:
                    "1px solid #ccc",
                  fontSize: "16px",
                  boxSizing:
                    "border-box",
                }}
              />
            </div>

            {/* 人数 */}
            <div
              style={{
                marginBottom:
                  "24px",
              }}
            >

              <div
                style={{
                  marginBottom:
                    "8px",
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

                {/* マイナス */}
                <button
                  onClick={() =>
                    setGroupSize(
                      Math.max(
                        1,
                        groupSize - 1
                      )
                    )
                  }
                  disabled={
                    submitting
                  }
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius:
                      "999px",
                    border: "none",
                    background:
                      "#ddd",
                    fontSize: "32px",
                    cursor:
                      "pointer",
                  }}
                >
                  -
                </button>

                {/* 人数 */}
                <div
                  style={{
                    fontSize: "32px",
                    minWidth: "40px",
                    textAlign:
                      "center",
                    fontWeight:
                      "bold",
                  }}
                >
                  {groupSize}
                </div>

                {/* プラス */}
                <button
                  onClick={() => {

                    if (
                      groupSize <
                        4 &&
                      groupSize <
                        remaining
                    ) {

                      setGroupSize(
                        groupSize +
                          1
                      );
                    }
                  }}
                  disabled={
                    submitting
                  }
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
                    cursor:
                      "pointer",
                  }}
                >
                  +
                </button>
              </div>

              <div
                style={{
                  marginTop: "10px",
                  color: "#666",
                  fontSize: "15px",
                }}
              >
                最大4人まで /
                残り{remaining}人
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
                onClick={() =>
                  setShowModal(false)
                }
                disabled={
                  submitting
                }
                style={{
                  flex: 1,
                  padding: "16px",
                  borderRadius:
                    "12px",
                  border: "none",
                  background:
                    "#ddd",
                  cursor:
                    "pointer",
                }}
              >
                キャンセル
              </button>

              <button
                onClick={reserve}
                disabled={
                  submitting
                }
                style={{
                  flex: 1,
                  padding: "16px",
                  borderRadius:
                    "12px",
                  border: "none",
                  background:
                    submitting
                      ? "#999"
                      : "#2563eb",
                  color: "white",
                  cursor:
                    submitting
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    submitting
                      ? 0.7
                      : 1,
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

      {/* 確認モーダル */}
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
            alignItems:
              "center",
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
                marginBottom:
                  "20px",
              }}
            >
              整理券確認
            </h2>

            <input
              value={ticketNickname}
              onChange={(e) =>
                setTicketNickname(
                  e.target.value
                )
              }
              placeholder="ニックネーム"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius:
                  "12px",
                border:
                  "1px solid #ccc",
                fontSize: "16px",
                marginBottom:
                  "16px",
                boxSizing:
                  "border-box",
              }}
            />

            <button
              onClick={checkTicket}
              disabled={checking}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius:
                  "12px",
                border: "none",
                background:
                  checking
                    ? "#999"
                    : "#2563eb",
                color: "white",
                fontSize: "18px",
                marginBottom:
                  "20px",
                cursor:
                  checking
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {checking
                ? "確認中..."
                : "確認"}
            </button>

            {ticket && (

              <div
                style={{
                  background:
                    "#f3f4f6",
                  borderRadius:
                    "12px",
                  padding: "16px",
                }}
              >

                <p>
                  整理券番号:
                  {" "}
                  {
                    ticket.ticket_number
                  }
                </p>

                <p>
                  時刻:
                  {" "}
                  {
                    typeof ticket.time_slot ===
                      "string" &&
                    ticket.time_slot.includes(
                      "T"
                    )
                      ? new Date(
                          ticket.time_slot
                        ).toLocaleTimeString(
                          "ja-JP",
                          {
                            hour:
                              "2-digit",
                            minute:
                              "2-digit",
                          }
                        )
                      : ticket.time_slot
                  }
                </p>

                <p>
                  人数:
                  {" "}
                  {
                    ticket.group_size
                  }
                </p>

                <p>
                  状態:
                  {" "}
                  {
                    ticket.status
                  }
                </p>

                <button
                  onClick={
                    cancelTicket
                  }
                  disabled={
                    canceling
                  }
                  style={{
                    width: "100%",
                    marginTop:
                      "16px",
                    padding:
                      "14px",
                    borderRadius:
                      "12px",
                    border:
                      "none",
                    background:
                      canceling
                        ? "#999"
                        : "#dc2626",
                    color: "white",
                    fontSize:
                      "16px",
                    cursor:
                      canceling
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {canceling
                    ? "キャンセル中..."
                    : "予約をキャンセル"}
                </button>

              </div>
            )}

            <button
              onClick={() =>
                setShowCheckModal(
                  false
                )
              }
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "14px",
                borderRadius:
                  "12px",
                border: "none",
                background:
                  "#ddd",
                fontSize: "16px",
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
