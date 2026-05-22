export async function POST(req: Request) {
  const body = await req.json();

  const GAS_URL =
    "https://script.google.com/macros/s/AKfycbwpdEk6rrGHsXW5WwyMRk2ggpULqNT3-WcJYTYFV5oK5QsDiAnAqGH2cGcoUWfAvjK8hQ/exec";

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
