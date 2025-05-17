export function getDoughnutNumbers() {
  return Array.from(
    { length: 5 },
    () => Math.floor(Math.random() * (30 - 5 + 1)) + 5
  );
}
