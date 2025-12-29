import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder
} from "discord.js";

export const name = "link";

export function build(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
  return subcommand
    .setName(name)
    .setDescription("Проверить YouTube ссылку и отправить подсказку")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("Ссылка на youtube.com или youtu.be")
        .setRequired(true)
    );
}

function isValidYouTubeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "");
    return hostname === "youtube.com" || hostname === "youtu.be";
  } catch {
    return false;
  }
}

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const url = interaction.options.getString("url", true);

  if (!isValidYouTubeUrl(url)) {
    await interaction.reply({
      content: "Пожалуйста, укажи корректную ссылку youtube.com или youtu.be.",
      ephemeral: true
    });
    return;
  }

  await interaction.reply({
    content: `Вот ссылка: ${url}\nВставь её в Watch Together для совместного просмотра.`
  });
}
