export function randomInt(limit = 10000) {
  return (Math.random() * limit) | 0;
}
