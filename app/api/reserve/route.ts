export async function POST(
  req: Request
) {

  const GAS_URL =
    "https://script.google.com/macros/s/AKfycbw2bN8SMdvGkluXbpURkMPz4yt2ZQHgWojRkC2Oy-BJXHn-Cf-A3DxTZYowfv_tuQCX-Q/exec";

  try {

    // フロントから受信
    const body =
      await req.json();

    console.log(
      "REQUEST BODY:",
      body
    );

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

    const text =
      await gasRes.text();

    console.log(
      "GAS RESPONSE:",
      text
    );

    return new Response(
      text,
      {
        status: 200,
      }
    );

  } catch (e) {

    console.error(e);

    return new Response(
      "SERVER_ERROR",
      {
        status: 500,
      }
    );
  }
}
