/**
 * Live gold/silver spot prices for the Zakat calculator's Nisab threshold.
 * Source: gold-api.com — free, no API key. Falls back to `null` prices on
 * any failure; the calculator then lets the user type in a price manually
 * rather than silently using a stale or made-up number.
 */

const TROY_OUNCE_GRAMS = 31.1034768;

export interface MetalPrices {
  goldPerGram: number | null;
  silverPerGram: number | null;
  fetchedAt: string;
}

async function fetchSpotPrice(symbol: 'XAU' | 'XAG'): Promise<number | null> {
  try {
    const res = await fetch(`https://api.gold-api.com/price/${symbol}`, {
      next: { revalidate: 3600 }, // spot price is fine to refresh hourly
    });
    if (!res.ok) return null;
    const data = await res.json();
    const perOunce = typeof data?.price === 'number' ? data.price : null;
    return perOunce === null ? null : perOunce / TROY_OUNCE_GRAMS;
  } catch {
    return null;
  }
}

export async function fetchMetalPrices(): Promise<MetalPrices> {
  const [goldPerGram, silverPerGram] = await Promise.all([
    fetchSpotPrice('XAU'),
    fetchSpotPrice('XAG'),
  ]);
  return { goldPerGram, silverPerGram, fetchedAt: new Date().toISOString() };
}
