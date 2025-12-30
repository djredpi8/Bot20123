import {
  ChatInputCommandInteraction,
  Client,
  GatewayIntentBits,
  Interaction,
  REST,
  Routes,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder
} from "discord.js";
import { config, validateConfig } from "./config";
import * as ytStart from "./commands/ytStart";
import * as ytHelp from "./commands/ytHelp";
import * as ytLink from "./commands/ytLink";

interface Subcommand {
  name: string;
  build: (subcommand: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

const subcommands: Subcommand[] = [ytStart, ytHelp, ytLink];

const ytCommand = new SlashCommandBuilder()
  .setName("yt")
  .setDescription("Watch Together commands");

subcommands.forEach((subcommand) => {
  ytCommand.addSubcommand((builder) => subcommand.build(builder));
});

async function registerCommands(): Promise<void> {
  const rest = new REST({ version: "10" }).setToken(config.token);
  await rest.put(Routes.applicationCommands(config.clientId), {
    body: [ytCommand.toJSON()]
  });
  console.log("Slash commands registered.");
}

async function main(): Promise<void> {
  validateConfig();

  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
  });

  client.once("ready", () => {
    console.log(`Logged in as ${client.user?.tag}`);
  });

  client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    if (interaction.commandName !== "yt") {
      return;
    }

    const subcommandName = interaction.options.getSubcommand();
    const handler = subcommands.find((sub) => sub.name === subcommandName);

    if (!handler) {
      await interaction.reply({
        content: "Неизвестная подкоманда.",
        ephemeral: true
      });
      return;
    }

    try {
      await handler.execute(interaction);
    } catch (error) {
      console.error("Command execution error", error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "Произошла ошибка при выполнении команды.",
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: "Произошла ошибка при выполнении команды.",
          ephemeral: true
        });
      }
    }
  });

  await registerCommands();
  await client.login(config.token);
}

main().catch((error) => {
  console.error("Startup error", error);
  process.exit(1);
});
