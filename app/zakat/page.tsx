import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ZakatCalculator } from '@/components/zakat/ZakatCalculator';
import { fetchMetalPrices } from '@/lib/zakat/metals';

export const revalidate = 3600;

export const metadata = {
  title: 'Zakat Calculator',
  description: 'Estimate your Zakat based on your assets and liabilities, using live gold and silver prices.',
};

export default async function ZakatPage() {
  const metalPrices = await fetchMetalPrices();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <ZakatCalculator goldPerGram={metalPrices.goldPerGram} silverPerGram={metalPrices.silverPerGram} />
    </div>
  );
}
