const cooldowns = new Map<string, number>();

export function isOnCooldown(userId: string, cooldownMs: number): boolean {
  const lastUsed = cooldowns.get(userId);
  if (!lastUsed) {
    return false;
  }
  return Date.now() - lastUsed < cooldownMs;
}

export function setCooldown(userId: string): void {
  cooldowns.set(userId, Date.now());
}

export function getRemainingCooldown(userId: string, cooldownMs: number): number {
  const lastUsed = cooldowns.get(userId) ?? 0;
  const remaining = cooldownMs - (Date.now() - lastUsed);
  return Math.max(0, remaining);
}
