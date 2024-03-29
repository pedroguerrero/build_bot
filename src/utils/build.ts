import jimp from 'jimp';
import { QueryFailedError } from 'typeorm';
import { EmbedBuilder } from '@discordjs/builders';
import {
  CacheType,
  AttachmentBuilder,
  CommandInteractionOption,
  ChatInputCommandInteraction,
} from 'discord.js';
import { fileExist } from './file';
import { generatePath } from './path';
import { Tag } from '../entities/tag.entity';
import { Upload } from '../enums/upload.enum';
import { Build } from '../entities/build.entity';
import { DbErrors } from '../enums/db-errors.enum';
import { ImageOpts } from '../enums/image-opts.enum';
import { SubCommands } from '../enums/sub-commands.enum';
import { AutoComplete } from '../interfaces/autocomplete.interface';
import { RepeatedBuildException } from '../exceptions/repeated-build.exception';

interface CreateBuild {
  name: string;
  fileUrl: string;
  tags: Tag[];
}

interface GetDataFromSubCommand {
  name: CommandInteractionOption<CacheType> | null;
  tag: CommandInteractionOption<CacheType> | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const evaluateSaveError = (name: string, error: any): void => {
  if (
    error instanceof QueryFailedError &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any).code === DbErrors.DUPLICATE_KEY
  ) {
    throw new RepeatedBuildException(`${name}: repeated build`);
  }

  throw error;
};

export const saveBuild = async ({
  name,
  tags,
}: CreateBuild): Promise<Build> => {
  const newBuild = new Build();
  newBuild.name = name;
  newBuild.tags = tags;

  try {
    await newBuild.save();
  } catch (error) {
    evaluateSaveError(name, error);
  }

  return newBuild;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getBuilds = async (filter = {}): Promise<Build[]> => {
  const builds = await Build.find(filter);

  return builds;
};

export const getBuildsAutoComplete = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter: any,
): Promise<AutoComplete[]> => {
  const builds = await getBuilds(filter);

  return builds.map(({ id, name }) => ({
    name: name,
    value: id.toString(),
  }));
};

export const buildEmbed = async (
  interaction: ChatInputCommandInteraction<CacheType>,
  build: Build,
): Promise<void> => {
  let buildImagePath = generatePath(
    __dirname,
    '..',
    Upload.DIRECTORY,
    build.id.toString(),
  );
  const embedBuild = new EmbedBuilder().setTitle(build.name);
  const exist = await fileExist(buildImagePath);

  if (!exist) {
    buildImagePath = generatePath(
      __dirname,
      '..',
      ImageOpts.ASSETS,
      ImageOpts.NOT_FOUND,
    );
  }

  const img = (await jimp.read(buildImagePath))
    .resize(ImageOpts.RESOLUTION, jimp.AUTO)
    .quality(ImageOpts.SIZE);
  const fileContent = await img.getBufferAsync(img.getMIME());
  const attachment = new AttachmentBuilder(fileContent);

  await interaction.editReply({
    embeds: [embedBuild],
    files: [attachment],
  });
};

export const getDataFromSubCommand = (
  interaction: ChatInputCommandInteraction<CacheType>,
): GetDataFromSubCommand => {
  const name = interaction.options.get(SubCommands.NAME);
  const tag = interaction.options.get(SubCommands.TAG);

  return { name, tag };
};
