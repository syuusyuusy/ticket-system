export default async function Page() {
  const res = await fetch("https://script.google.com/macros/s/AKfycbxLqZWWMPXsy5UMY4Zs1m5FSiXkEa1zNRQOdjzUmU-MGKwnFuMd-1DeygyTZeZE83DeEw/exec", {
    cache: "no-store",
  });

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
              {item.time_slot.slice(0, 5)}（残り{item.remaining}人）
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
