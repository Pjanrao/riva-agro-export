// src/lib/getUsdRate.ts
export async function getUsdRate() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      // cache for 6 hours (VERY IMPORTANT)
      next: { revalidate: 21600 },
    });

    if (!res.ok) throw new Error("Rate fetch failed");

    const data = await res.json();

    // API gives INR per USD
    // We want USD per INR
    return 1 / data.rates.INR;
  } catch (error) {
    console.error("USD rate fallback used");
    return 0.012; // safe fallback
  }
}
