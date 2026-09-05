/**
 * Stub adapters for mosques with no public event feeds.
 *
 * Research conducted 2026-09-05:
 *   - BCIEC        (bciec.org)          — GoDaddy site builder, no calendar/feed
 *   - Nida-Ul Islam (nidaulislam.org)   — site unreachable / timeout
 *   - Al Aisha     (masjidalaisha.org)  — no events section found
 *   - Ulu Cami     (ulucami.org)        — WhatsApp-only updates, no web calendar
 *   - Omar Mosque  (omarmosque.org)     — basic site, no events section
 *   - Fusion MCC   (fmccnj.com)        — site loaded but no calendar feed found
 *   - Diyanet Bergen (diyanetamerica.org) — national site, no mosque-specific feed
 *
 * Each stub returns status 'no_source' so the aggregator can report accurately.
 * When a mosque adds a public calendar, replace the stub with a real adapter.
 */

import type { ImportResult, SourceMeta } from './types';

function noSource(mosqueId: string, mosqueName: string, websiteUrl: string): ImportResult {
  return {
    meta: {
      mosqueId,
      mosqueName,
      sourceUrl: websiteUrl,
      sourceType: 'none',
    } as SourceMeta,
    status: 'no_source',
    eventsFound: 0,
    events: [],
    fetchedAt: new Date().toISOString(),
  };
}

export async function fetchBciecEvents(): Promise<ImportResult> {
  return noSource('bciec', 'Bergen County Islamic Education Center', 'https://bciec.org');
}

export async function fetchNidaEvents(): Promise<ImportResult> {
  return noSource('nida-ul-islam', 'Nida-Ul Islam Center', 'https://nidaulislam.org');
}

export async function fetchAlAishaEvents(): Promise<ImportResult> {
  return noSource('masjid-al-aisha', 'Al Aisha Mosque', 'https://masjidalaisha.org');
}

export async function fetchUluCamiEvents(): Promise<ImportResult> {
  return noSource('ulu-cami', 'United Islamic Center (Ulu Cami Mosque)', 'https://ulucami.org');
}

export async function fetchOmarMosqueEvents(): Promise<ImportResult> {
  return noSource('omar-mosque', 'Omar Mosque', 'https://omarmosque.org');
}

export async function fetchFusionEvents(): Promise<ImportResult> {
  return noSource('mcc-paramus', 'Muslim Community Center of Paramus (The Fusion)', 'https://fmccnj.com');
}

export async function fetchDiyanetEvents(): Promise<ImportResult> {
  return noSource('diyanet-bergen', 'Diyanet Mosque of Bergen', 'https://diyanetamerica.org/mosques/bergen-diyanet-mosque/');
}
