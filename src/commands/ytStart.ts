import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  InviteTargetType,
  SlashCommandSubcommandBuilder
} from "discord.js";
import { canCreateInvite } from "../lib/permissions";
import { getRemainingCooldown, isOnCooldown, setCooldown } from "../lib/cooldown";

const COOLDOWN_MS = 10_000;

export const name = "start";

export function build(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
  return subcommand
    .setName(name)
    .setDescription("Создать Watch Together invite для текущего voice-канала");
}

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  if (!interaction.inGuild()) {
    await interaction.reply({
      content: "Эта команда доступна только на сервере.",
      ephemeral: true
    });
    return;
  }

  const member = interaction.member as GuildMember;
  const voiceChannel = member.voice.channel;

  if (!voiceChannel ||
    (voiceChannel.type !== ChannelType.GuildVoice && voiceChannel.type !== ChannelType.GuildStageVoice)
  ) {
    await interaction.reply({
      content: "Подключись к voice-каналу, чтобы создать Watch Together.",
      ephemeral: true
    });
    return;
  }

  if (isOnCooldown(member.id, COOLDOWN_MS)) {
    const remaining = Math.ceil(getRemainingCooldown(member.id, COOLDOWN_MS) / 1000);
    await interaction.reply({
      content: `Подожди ${remaining} сек. перед повторным использованием /yt start.`,
      ephemeral: true
    });
    return;
  }

  const me = interaction.guild?.members.me;
  if (!me) {
    await interaction.reply({
      content: "Не удалось определить права бота.",
      ephemeral: true
    });
    return;
  }

  if (!canCreateInvite(voiceChannel, me)) {
    await interaction.reply({
      content: "Мне нужно право Create Instant Invite в этом voice-канале.",
      ephemeral: true
    });
    return;
  }

  setCooldown(member.id);

  const invite = await voiceChannel.createInvite({
    maxAge: 3600,
    maxUses: 0,
    targetType: InviteTargetType.EmbeddedApplication,
    targetApplication: "880218394199220334",
    reason: `Watch Together requested by ${interaction.user.tag}`
  });

  const embed = new EmbedBuilder()
    .setTitle("Watch Together")
    .setDescription("Нажми кнопку ниже, чтобы открыть YouTube Activity.")
    .setColor(0xff0000)
    .addFields({
      name: "Канал",
      value: voiceChannel.name
    });

  const button = new ButtonBuilder()
    .setLabel("Open Watch Together")
    .setStyle(ButtonStyle.Link)
    .setURL(invite.url);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

  await interaction.reply({ embeds: [embed], components: [row] });
}
