export default async function Page() {
  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbzKiw27VfA2g-Zg8KZzm4WvqHOsod5aV0CWgKi2xZXh0gLvMhglDysx-1pL1yRwoHPnQA/exec", {
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
