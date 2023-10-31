import {
  CacheType,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from 'discord.js';
import { Command } from '../enums/commands.enum';
import { getDataFromSubCommand } from '../utils/build';
import { SubCommands } from '../enums/sub-commands.enum';
import { getBuildByName, getBuildByTag } from '../utils/get-build';

export default {
  data: new SlashCommandBuilder()
    .setName(Command.GET_BUILD)
    .setDescription(Command.GET_BUILD_DESCRIPTION)
    .addSubcommand((subcommand) =>
      subcommand
        .setName(SubCommands.NAME)
        .setDescription(SubCommands.NAME_DESCRIPTION)
        .addStringOption((option) =>
          option
            .setName(SubCommands.NAME)
            .setDescription(SubCommands.NAME_AUTOCOMPLETE_DESCRIPTION)
            .setAutocomplete(true)
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(SubCommands.TAG)
        .setDescription(SubCommands.TAG_DESCRIPTION)
        .addStringOption((option) =>
          option
            .setName(SubCommands.TAG)
            .setDescription(SubCommands.TAG_AUTOCOMPLETE_DESCRIPTION)
            .setAutocomplete(true)
            .setRequired(true),
        ),
    ),
  async execute(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    const { name, tag } = getDataFromSubCommand(interaction);

    if (name) {
      getBuildByName(interaction, name);

      return;
    } else if (tag) {
      getBuildByTag(interaction, tag);

      return;
    }
  },
};
