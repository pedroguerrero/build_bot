import {
  CacheType,
  CommandInteractionOption,
  ChatInputCommandInteraction,
} from 'discord.js';
import { showError } from './commands';
import { isStringNumber } from './validation';
import { getBuilds, buildEmbed } from './build';
import { Response } from '../enums/response.enum';
import { embedBuildsFromTags, getAllTags } from './tags';

export const getBuildByName = async (
  interaction: ChatInputCommandInteraction<CacheType>,
  name: CommandInteractionOption<CacheType>,
): Promise<void> => {
  const value = name.value?.toString() as string;

  if (!isStringNumber(value)) {
    showError(interaction, Response.UNKNOWN_BUILD);

    return;
  }

  const [build] = await getBuilds({ where: { id: Number(value) } });

  await buildEmbed(interaction, build);
};

export const getBuildByTag = async (
  interaction: ChatInputCommandInteraction<CacheType>,
  tag: CommandInteractionOption<CacheType>,
): Promise<void> => {
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
};
