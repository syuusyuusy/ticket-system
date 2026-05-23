const reserve = async () => {

  if (submitting) return;

  if (!nickname.trim()) {
    alert("ニックネームを入力してください");
    return;
  }

  if (groupSize > 4) {
    alert("1回の予約は4人までです");
    return;
  }

  if (groupSize > remaining) {
    alert("残り人数を超えています");
    return;
  }

  try {

    setSubmitting(true);

    const res = await fetch(
      "/api/reserve",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          time_slot: selectedTime,
          nickname,
          group_size: groupSize,
        }),
      }
    );

    const result = await res.text();

    // 名前重複
    if (result === "NAME_EXISTS") {

      alert(
        "このニックネームは使用中です"
      );

      return;
    }

    // 満席
    if (result === "FULL") {

      alert("満席です");

      return;
    }

    // CLOSED
    if (result === "CLOSED") {

      alert("受付終了しました");

      return;
    }

    // 人数超過
    if (result === "TOO_MANY") {

      alert(
        "1回の予約は4人までです"
      );

      return;
    }

    alert("予約完了！");

    setShowModal(false);

    loadSlots();

  } catch (e) {

    console.error(e);

    alert("予約失敗");

  } finally {

    setSubmitting(false);
  }
};
