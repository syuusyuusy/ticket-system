export async function POST(
  req: Request
) {

  // GASのexec URL
  const GAS_URL =
    "https://script.google.com/macros/s/AKfycbw2bN8SMdvGkluXbpURkMPz4yt2ZQHgWojRkC2Oy-BJXHn-Cf-A3DxTZYowfv_tuQCX-Q/exec";

  try {

    // フロントから受信
    const body =
      await req.json();

    // GASへ転送
    const gasRes =
      await fetch(
        GAS_URL,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(body),
        }
      );

    // GASレスポンス取得
    const text =
      await gasRes.text();

    console.log(
      "GAS RESPONSE:",
      text
    );

    // そのまま返却
    return new Response(
      text,
      {
        status: 200,
      }
    );

  } catch (e) {

    console.error(e);

    return new Response(
      "ERROR",
      {
        status: 500,
      }
    );
  }
}
