'use client';

import { useMemo, useState } from 'react';
import {
  Calculator, Wallet, Coins, Gem, TrendingUp, HandCoins, Package, PlusCircle,
  MinusCircle, Info, Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const GOLD_NISAB_GRAMS = 85;
const SILVER_NISAB_GRAMS = 595;
const ZAKAT_RATE = 0.025;

interface AssetField {
  key: string;
  label: string;
  icon: typeof Wallet;
  placeholder: string;
}

const ASSET_FIELDS: AssetField[] = [
  { key: 'cash', label: 'Cash / Bank Balances', icon: Wallet, placeholder: 'e.g. 10000' },
  { key: 'gold', label: 'Gold Value', icon: Coins, placeholder: 'Value of gold you own' },
  { key: 'silver', label: 'Silver Value', icon: Gem, placeholder: 'Value of silver you own' },
  { key: 'investments', label: 'Investments / Stocks', icon: TrendingUp, placeholder: 'e.g. 5000' },
  { key: 'receivables', label: 'Money Owed to You', icon: HandCoins, placeholder: 'Expected to be repaid' },
  { key: 'inventory', label: 'Business / Trade Inventory', icon: Package, placeholder: 'Resale value' },
  { key: 'other', label: 'Other Zakatable Assets', icon: PlusCircle, placeholder: 'Anything else zakatable' },
];

type Assets = Record<string, string>;

function toNumber(v: string): number {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function formatUSD(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}

interface ZakatCalculatorProps {
  goldPerGram: number | null;
  silverPerGram: number | null;
}

export function ZakatCalculator({ goldPerGram, silverPerGram }: ZakatCalculatorProps) {
  const [assets, setAssets] = useState<Assets>(
    Object.fromEntries(ASSET_FIELDS.map(f => [f.key, '']))
  );
  const [liabilities, setLiabilities] = useState('');
  const [nisabStandard, setNisabStandard] = useState<'gold' | 'silver'>('gold');

  // Live price can fail to load — let the user type today's price in that case
  // rather than silently computing a wrong Nisab from a missing/zero value.
  const [manualGoldPrice, setManualGoldPrice] = useState('');
  const [manualSilverPrice, setManualSilverPrice] = useState('');

  const effectiveGoldPerGram = goldPerGram ?? toNumber(manualGoldPrice);
  const effectiveSilverPerGram = silverPerGram ?? toNumber(manualSilverPrice);

  const totalAssets = useMemo(
    () => ASSET_FIELDS.reduce((sum, f) => sum + toNumber(assets[f.key]), 0),
    [assets]
  );
  const totalLiabilities = toNumber(liabilities);
  const netWealth = Math.max(0, totalAssets - totalLiabilities);

  const nisabValue = nisabStandard === 'gold'
    ? effectiveGoldPerGram * GOLD_NISAB_GRAMS
    : effectiveSilverPerGram * SILVER_NISAB_GRAMS;

  const meetsNisab = nisabValue > 0 && netWealth >= nisabValue;
  const zakatDue = meetsNisab ? netWealth * ZAKAT_RATE : 0;

  function setAsset(key: string, value: string) {
    setAssets(prev => ({ ...prev, [key]: value }));
  }

  return (
    <section id="zakat-calculator" className="scroll-mt-20">
      <div className="flex items-center gap-2 mb-1">
        <Calculator className="w-5 h-5 text-emerald-600" />
        <h2 className="text-xl font-bold text-stone-900">Zakat Calculator</h2>
      </div>
      <p className="text-sm text-stone-600 mb-4">
        Estimate your Zakat based on your assets and liabilities.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Assets & liabilities inputs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Zakatable Assets</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ASSET_FIELDS.map(field => (
                <label key={field.key} className="block">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-stone-600 mb-1">
                    <field.icon className="w-3.5 h-3.5 text-emerald-600" />
                    {field.label}
                  </span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                    <input
                      type="number"
                      min="0"
                      inputMode="decimal"
                      value={assets[field.key]}
                      onChange={e => setAsset(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full pl-6 pr-3 py-2 border border-stone-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Liabilities</h3>
            <label className="block max-w-xs">
              <span className="flex items-center gap-1.5 text-xs font-medium text-stone-600 mb-1">
                <MinusCircle className="w-3.5 h-3.5 text-red-500" />
                Eligible Short-Term Debts
              </span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  inputMode="decimal"
                  value={liabilities}
                  onChange={e => setLiabilities(e.target.value)}
                  placeholder="e.g. 2000"
                  className="w-full pl-6 pr-3 py-2 border border-stone-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>
            </label>
          </div>

          {/* Nisab standard */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Nisab Standard</h3>
            <div className="flex gap-2 mb-3">
              {(['gold', 'silver'] as const).map(standard => (
                <button
                  key={standard}
                  onClick={() => setNisabStandard(standard)}
                  className={cn(
                    'flex-1 px-4 py-2 rounded-xl text-sm font-medium border transition-colors capitalize',
                    nisabStandard === standard
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-emerald-50 hover:text-emerald-700'
                  )}
                >
                  {standard} standard ({standard === 'gold' ? `${GOLD_NISAB_GRAMS}g` : `${SILVER_NISAB_GRAMS}g`})
                </button>
              ))}
            </div>

            {/* Live price status / manual fallback */}
            {nisabStandard === 'gold' && goldPerGram === null && (
              <label className="block">
                <span className="text-xs font-medium text-amber-700 mb-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Couldn&apos;t fetch live gold price — enter today&apos;s price per gram
                </span>
                <div className="relative max-w-[160px]">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    inputMode="decimal"
                    value={manualGoldPrice}
                    onChange={e => setManualGoldPrice(e.target.value)}
                    placeholder="per gram"
                    className="w-full pl-6 pr-3 py-2 border border-amber-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </label>
            )}
            {nisabStandard === 'silver' && silverPerGram === null && (
              <label className="block">
                <span className="text-xs font-medium text-amber-700 mb-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Couldn&apos;t fetch live silver price — enter today&apos;s price per gram
                </span>
                <div className="relative max-w-[160px]">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    inputMode="decimal"
                    value={manualSilverPrice}
                    onChange={e => setManualSilverPrice(e.target.value)}
                    placeholder="per gram"
                    className="w-full pl-6 pr-3 py-2 border border-amber-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </label>
            )}
            {((nisabStandard === 'gold' && goldPerGram !== null) || (nisabStandard === 'silver' && silverPerGram !== null)) && (
              <p className="text-xs text-stone-400">
                Using live {nisabStandard} price of {formatUSD(nisabStandard === 'gold' ? effectiveGoldPerGram : effectiveSilverPerGram)}/gram
              </p>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 sticky top-20 space-y-3">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-1">Summary</h3>

            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Total Assets</span>
              <span className="font-semibold text-stone-800">{formatUSD(totalAssets)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Liabilities</span>
              <span className="font-semibold text-red-500">−{formatUSD(totalLiabilities)}</span>
            </div>
            <div className="h-px bg-stone-100" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-600 font-medium">Net Zakatable Wealth</span>
              <span className="font-bold text-stone-900">{formatUSD(netWealth)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">
                Selected Nisab ({nisabStandard})
                {goldPerGram === null && silverPerGram === null && nisabValue === 0 && (
                  <Loader2 className="w-3 h-3 inline ml-1 animate-spin" />
                )}
              </span>
              <span className="font-semibold text-stone-800">{formatUSD(nisabValue)}</span>
            </div>

            <div className="mt-2 bg-linear-to-br from-emerald-600 to-teal-700 rounded-2xl p-4 text-center text-white">
              <p className="text-emerald-100 text-xs uppercase tracking-wide mb-1">Estimated Zakat Due</p>
              <p className="text-3xl font-bold">{formatUSD(zakatDue)}</p>
              {!meetsNisab && (netWealth > 0 || totalLiabilities > 0) && (
                <p className="text-emerald-100 text-xs mt-1">Below Nisab — no Zakat due</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800 flex gap-2">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
        <p>
          This is an educational estimate only. Zakat rules can differ based on individual circumstances and
          scholarly opinions — please consult a qualified scholar for guidance specific to your situation.
        </p>
      </div>
    </section>
  );
}
