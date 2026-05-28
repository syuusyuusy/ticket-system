export async function POST(
  req: Request
) {

  const GAS_URL =
    "https://script.google.com/macros/s/AKfycbz5px5E_tLLC1ElGrR9fybiRx6dk9QImuQJlQ6B9fx19mARxDVmPAqM1t5CLK9bpP74Ag/exec";

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
