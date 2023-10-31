import { CacheType, AutocompleteInteraction } from 'discord.js';

interface GetAutoCompleteData {
  commandName: string;
  subCommand: string;
  textValue: string;
}

export const getAutoCompleteData = (
  interaction: AutocompleteInteraction<CacheType>,
): GetAutoCompleteData => {
  const { commandName } = interaction;
  const subCommand = interaction.options.getSubcommand();
  const textValue = interaction.options.getFocused();

  return { commandName, subCommand, textValue };
};
