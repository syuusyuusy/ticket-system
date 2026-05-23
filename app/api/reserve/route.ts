export async function POST(
  req: Request
) {

  const GAS_URL =
    "https://script.google.com/macros/s/AKfycbwUQ0dHPC5abaZ9SQG_0cTItPOWrM2Qp3uHaNnYC_4CkDwvlrEkRnjmbYbCeUG4Gb7kNw/exec";

  try {

    const body =
      await req.json();

    const res =
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
      await res.text();

    return new Response(text);

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
