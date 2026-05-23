export async function POST(
  req: Request
) {

  // GASのexec URL
  const GAS_URL =
    "https://script.google.com/macros/s/AKfycbwdzhQxJDtsoHfK78SB67aA6Btwze-2aE0E7m90mvykZ_j3upDdxR37MP31H3RGSCxs_A/exec";

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
