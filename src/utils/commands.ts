import {
  CacheType,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
} from 'discord.js';
import { Like } from 'typeorm';
import { getTagsAutoComplete } from './tags';
import { getBuildsAutoComplete } from './build';
import { Command } from '../enums/commands.enum';
import { Response } from '../enums/response.enum';
import { getAutoCompleteData } from './auto-complete';
import { SubCommands } from '../enums/sub-commands.enum';
import { availableCommands, commands } from '../commands';

export const hasCommand = (commandName: string): boolean => {
  return availableCommands.indexOf(commandName) !== -1;
};

export const runCommand = async (
  interaction: ChatInputCommandInteraction<CacheType>
): Promise<void> => {
  const commandName = interaction.commandName as keyof typeof commands;

  if (hasCommand(commandName)) {
    await commands[commandName].execute(interaction);

    return;
  }

  await showError(interaction, Response.COMMAND_RUN_ERROR);
};

export const runAutoComplete = async (
  interaction: AutocompleteInteraction<CacheType>
): Promise<void> => {
  const { commandName, subCommand, textValue } =
    getAutoCompleteData(interaction);

  if (commandName !== Command.GET_BUILD) {
    return;
  }

  const filter = {
    where: { name: Like(`%${textValue}%`) },
  };

  if (subCommand === SubCommands.NAME) {
    const builds = await getBuildsAutoComplete(filter);

    interaction.respond(builds);
  } else if (subCommand === SubCommands.TAG) {
    const tags = await getTagsAutoComplete(filter);

    interaction.respond(tags);
  }
};

export const showError = async (
  interaction: ChatInputCommandInteraction<CacheType>,
  message: string
): Promise<void> => {
  await interaction.editReply({
    content: message,
  });
};
