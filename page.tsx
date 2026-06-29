export default async function Page() {
  const res = await fetch("https://script.google.com/macros/s/AKfycbwULF0fpoWAjGlubEem8beeP8ViozQ2YWGhNNj5b61ACAhA7OhwmNvxGWJ4Yuj3eRUQ7Q/exec", {
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
