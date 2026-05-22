export async function POST(req: Request) {
  const body = await req.json();

  const GAS_URL =
    "https://script.google.com/macros/s/AKfycbw4ljJo3oCxvzK62WXboP-Tf0031XQ5mSGNv9WIo8n2InTfrcJt_oZh8wAfIkxvyP5s/exec";

  try {
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();

    return new Response(text, {
      status: 200,
    });

  } catch (e) {
    console.error(e);

    return new Response("ERROR", {
      status: 500,
    });
  }
}