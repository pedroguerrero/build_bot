import {
  CacheType,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from 'discord.js';
import { showError } from '../utils/commands';
import { Command } from '../enums/commands.enum';
import { Response } from '../enums/response.enum';
import { isStringNumber } from '../utils/validation';
import { SubCommands } from '../enums/sub-commands.enum';
import { embedBuildsFromTags, getAllTags } from '../utils/tags';
import { buildEmbed, getBuilds, getDataFromSubCommand } from '../utils/build';

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
            .setRequired(true)
        )
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
            .setRequired(true)
        )
    ),
  async execute(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    const { name, tag } = getDataFromSubCommand(interaction);

    if (name) {
      const value = name.value?.toString() as string;

      if (!isStringNumber(value)) {
        showError(interaction, Response.UNKNOWN_BUILD);

        return;
      }

      const [build] = await getBuilds({ where: { id: Number(value) } });

      await buildEmbed(interaction, build);

      return;
    } else if (tag) {
      const value = tag.value?.toString() as string;

      if (!isStringNumber(value)) {
        showError(interaction, Response.UNKNOWN_BUILD);

        return;
      }

      const [tagRecord] = await getAllTags({
        where: { id: Number(value) },
        relations: ['builds'],
      });

      await embedBuildsFromTags(interaction, tagRecord);

      return;
    }
  },
};
