export default async function Page() {
  const res = await fetch("https://script.googleusercontent.com/macros/echo?user_content_key=AWDtjMVg5GrFmzk4YO-DVoCvt5ol_FsM2YnZg2nfRT9i8gozwmpaKFzmzY2U9SKEkUseaadEED9ODIjO-ek9R06vgzrC1ICV1BiNdpfu59e9mZswR1lQee5veN1LMy-Ins0vp3fEIhsV7-AGS9d2ms55op7vwLxhBOVd_kuPvZRiZZtOnbR9Nfbhdl5HgwHyQwzWcQkSFhWjS46K2zcTbcakA82_IciTbzaFz8QpyB9RBHtTgUJxAnaHtc2eF9tgE_DBoqKAo30mVVPbREm9FUx3LkzSK5TMDg&lib=MNyNcv_qMnCu0mlCuA1J48nJa9p4FWqyd", {
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
              {item.time_slot}（残り{item.remaining}人）
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
