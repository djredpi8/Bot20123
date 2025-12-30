import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder
} from "discord.js";

export const name = "help";

export function build(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
  return subcommand
    .setName(name)
    .setDescription("Краткая справка по Watch Together");
}

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const embed = new EmbedBuilder()
    .setTitle("Watch Together — помощь")
    .setDescription(
      "Команды:\n" +
        "• /yt start — создать invite в твой voice-канал.\n" +
        "• /yt link <url> — проверить ссылку на YouTube и отправить подсказку."
    )
    .setColor(0x5865f2);

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
