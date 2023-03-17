import { EmbedBuilder } from '@discordjs/builders';
import {
  CacheType,
  CommandInteractionOption,
  ChatInputCommandInteraction,
} from 'discord.js';
import { Tag } from '../entities/tag.entity';
import { Build } from '../entities/build.entity';
import { Response } from '../enums/response.enum';
import { SubCommands } from '../enums/sub-commands.enum';
import { AutoComplete } from '../interfaces/autocomplete.interface';

interface CreateBuild {
  name: string;
  fileUrl: string;
  tags: Tag[];
}

interface GetDataFromSubCommand {
  name: CommandInteractionOption<CacheType> | null;
  tag: CommandInteractionOption<CacheType> | null;
}

export const saveBuild = async ({
  name,
  fileUrl,
  tags,
}: CreateBuild): Promise<Build> => {
  const newBuild = new Build();
  newBuild.name = name;
  newBuild.img = fileUrl;
  newBuild.tags = tags;

  await newBuild.save();

  return newBuild;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getBuilds = async (filter = {}): Promise<Build[]> => {
  const builds = await Build.find(filter);

  return builds;
};

export const getBuildsAutoComplete = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter: any
): Promise<AutoComplete[]> => {
  const builds = await getBuilds(filter);

  return builds.map(({ id, name }) => ({
    name: name,
    value: id.toString(),
  }));
};

export const buildEmbed = async (
  interaction: ChatInputCommandInteraction<CacheType>,
  build: Build
): Promise<void> => {
  const embedBuild = new EmbedBuilder()
    .setTitle(build.name)
    .setImage(build.img);

  await interaction.channel?.send({ embeds: [embedBuild] });
  await interaction.reply(Response.GET_BUILDS);
};

export const getDataFromSubCommand = (
  interaction: ChatInputCommandInteraction<CacheType>
): GetDataFromSubCommand => {
  const name = interaction.options.get(SubCommands.NAME);
  const tag = interaction.options.get(SubCommands.TAG);

  return { name, tag };
};
