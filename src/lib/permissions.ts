import {
  GuildBasedChannel,
  GuildMember,
  PermissionsBitField
} from "discord.js";

export function canCreateInvite(channel: GuildBasedChannel, member: GuildMember): boolean {
  const permissions = channel.permissionsFor(member);
  if (!permissions) {
    return false;
  }
  return permissions.has(PermissionsBitField.Flags.CreateInstantInvite);
}
