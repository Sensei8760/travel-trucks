export function buildQuery(params: object) {
  const query = new URLSearchParams();

  Object.entries(params as Record<string, unknown>).forEach(([k, v]) => {
    if (v === undefined || v === null) return;

    if (typeof v === 'string') {
      const trimmed = v.trim();
      if (!trimmed) return;
      query.set(k, trimmed);
      return;
    }

    if (typeof v === 'boolean') {
      if (!v) return;
      query.set(k, 'true');
      return;
    }

    query.set(k, String(v));
  });

  return query.toString();
}
