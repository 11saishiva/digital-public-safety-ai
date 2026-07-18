export function formatConfidence(confidence: number): string {
  const pct = confidence <= 1 ? confidence * 100 : confidence;
  return `${pct.toFixed(1)}%`;
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function formatMs(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

export function truncate(text: string, length = 100): string {
  return text.length > length ? `${text.slice(0, length)}…` : text;
}
