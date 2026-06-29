export default async function Page() {
  const res = await fetch("https://script.google.com/macros/s/AKfycbwzL6uB69lzj1if9e3oFzhYIq4X54FAwMpxkXEPfbHoq8ZpEGTDl2U8KMhO-YEEMObKmQ/exec", {
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
