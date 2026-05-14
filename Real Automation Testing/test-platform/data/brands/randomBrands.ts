// ==============================
// 🔹 RANDOM SINGLE BRAND
// ==============================

export function getRandomBrandIndex(totalBrands: number): number {
  return Math.floor(Math.random() * totalBrands);
}


// ==============================
// 🔹 RANDOM MULTI BRAND
// ==============================

export const randomMultiConfig = {
  selectionCount: 6
};

export function getUniqueRandomIndexes(
  totalBrands: number,
  count: number
): number[] {

  const selected: number[] = [];

  while (selected.length < count) {
    const randomIndex = Math.floor(Math.random() * totalBrands);

    if (!selected.includes(randomIndex)) {
      selected.push(randomIndex);
    }
  }

  return selected;
}