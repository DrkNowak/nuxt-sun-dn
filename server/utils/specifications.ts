export function parseSpecifications(description: string) {
  const capacityMatch = description.match(/(\d+(?:[.,]\d+)?)\s*(kWh|Wh)\b/i);
  const powerMatch = description.match(/(\d+(?:[.,]\d+)?)\s*(kW|W)\b/i);

  let capacityKwh: number | null = null;
  let powerW: number | null = null;

  if (capacityMatch) {
    const value = Number(capacityMatch[1]?.replace(',', '.'));

    capacityKwh = capacityMatch[2]?.toLowerCase() === 'wh' ? value / 1000 : value;
  }

  if (powerMatch) {
    const value = Number(powerMatch[1]?.replace(',', '.'));

    powerW = powerMatch[2]?.toLowerCase() === 'kw' ? value * 1000 : value;
  }

  return { capacityKwh, powerW };
}
