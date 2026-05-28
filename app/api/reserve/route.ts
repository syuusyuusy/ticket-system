export async function POST(
  req: Request
) {

  const GAS_URL =
    "https://script.google.com/macros/s/AKfycbzCWfNsp-7gumlNIWhM-TgUd3LV_tfPqtD7w77TSA2jCTdJj0KqfQAnrM5r7OOLtJBD/exec";

  try {

    // フロントから受信
    const body =
      await req.json();

    console.log(body);

    // そのまま転送
    const gasRes =
      await fetch(
        GAS_URL,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },

          // ←ここ重要
          body: JSON.stringify(body),
        }
      );

    const text =
      await gasRes.text();

    console.log(text);

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
