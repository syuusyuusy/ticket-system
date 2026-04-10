export default async function Page() {
  try {
    const res = await fetch("https://script.googleusercontent.com/macros/echo?user_content_key=AWDtjMWdzCMvI8XUMZB9L25pgoAl9Pu3o35ZMvK1SeSh9GBn2OC642YtaM78cv8jwR5AsU7DP2HTuFRyNS_G2JCQAVNvECdR4R48yBPsjms-5602VZN52rLtQSZjEnXMSa-1G0hxXOiWlfbIy0dHVWH2o32Adq7PjneCwyFT5MpiBmEzTR_oA_ySWg8qrLM_FRHh1j4qhnDcoraH4dsQhRhVCgaShmIgKZfhaXhybhE2IbfzJdRxdhxFW573iItA1ngrCuZ_8z1Z2TOS29z7Tp_0XDBzFPXJBg&lib=MNyNcv_qMnCu0mlCuA1J48nJa9p4FWqyd", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("fetch failed");
    }

    const data = await res.json();

    return (
      <div style={{ padding: "20px" }}>
        <h1>予約可能な時間</h1>

        {data.length === 0 ? (
          <p>現在空きはありません</p>
        ) : (
          <ul>
            {data.map((item: any, i: number) => (
              <li key={i}>
                {item.time_slot}（残り{item.remaining}人）
              </li>
            ))}
          </ul>
        )}
      </div>
    );

  } catch (e) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>エラー発生</h1>
        <p>データ取得に失敗しました</p>
      </div>
    );
  }
}
