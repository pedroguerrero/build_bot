import 'reflect-metadata';
import * as dotenv from 'dotenv';

dotenv.config();

import {
  Client,
  Events,
  CacheType,
  Interaction,
  GatewayIntentBits,
} from 'discord.js';
import { AppDataSource } from './data-source';
import { Response } from './enums/response.enum';
import { runAutoComplete, runCommand, showError } from './utils/commands';

const {
  env: { TOKEN },
} = process;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

(async () => {
  try {
    await AppDataSource.initialize();
  } catch (error) {
    console.error('Error initializing the db');

    process.exit(1);
  }
})();

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(
  Events.InteractionCreate,
  async (interaction: Interaction<CacheType>) => {
    if (!interaction.isAutocomplete()) {
      return;
    }

    try {
      await runAutoComplete(interaction);
    } catch (error) {
      console.error(error);
    }
  }
);

client.on(
  Events.InteractionCreate,
  async (interaction: Interaction<CacheType>) => {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    await interaction.deferReply({
      fetchReply: true,
    });

    try {
      await runCommand(interaction);
    } catch (error) {
      console.log(error);
      await showError(interaction, Response.COMMAND_RUN_ERROR);
    }
  }
);

client.login(TOKEN);
