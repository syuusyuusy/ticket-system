export async function POST(
  req: Request
) {

  const GAS_URL =
    "https://script.google.com/macros/s/AKfycby_CYCOok9ozm2Kg_bGoCi1NneqrX1Wfw2CkXZaTwymRqPwCDf27AImxPN3bAL_UzUOEA/exec";

  try {

    const body =
      await req.json();

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
      "ERROR",
      {
        status: 500,
      }
    );
  }
}
