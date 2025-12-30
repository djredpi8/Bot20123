import "dotenv/config";

export const config = {
  token: process.env.DISCORD_TOKEN ?? "",
  clientId: process.env.CLIENT_ID ?? ""
};

export function validateConfig(): void {
  if (!config.token || !config.clientId) {
    throw new Error("Missing DISCORD_TOKEN or CLIENT_ID in environment.");
  }
}
