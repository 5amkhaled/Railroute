export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const trainNumber = url.searchParams.get("train");

    if (!trainNumber) {
      return Response.json({ error: "train number required" }, { status: 400 });
    }

    const res = await fetch(
      `https://irctc1.p.rapidapi.com/api/v1/trainStatus?trainNo=${trainNumber}`,
      {
        headers: {
          "x-rapidapi-key": RAILWAY_API_KEY,
          "x-rapidapi-host": "irctc1.p.rapidapi.com",
        },
      }
    );

    const data = await res.json();

    return Response.json(data, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  },
};

declare const RAILWAY_API_KEY: string;