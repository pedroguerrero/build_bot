import jimp from 'jimp';
import {
  CacheType,
  Attachment,
  AttachmentBuilder,
  CommandInteractionOption,
  ChatInputCommandInteraction,
} from 'discord.js';
import { generatePath } from './path';
import { Tag } from '../entities/tag.entity';
import { Upload } from '../enums/upload.enum';
import { AutoComplete } from '../interfaces/autocomplete.interface';
import { SaveBuildAttributes } from '../enums/save-build-attributes.enum';
import { ImageOpts } from '../enums/image-opts.enum';

interface ISaveBuildAttributes {
  file: Attachment;
  buildName: CommandInteractionOption<CacheType>;
  tags: CommandInteractionOption<CacheType>;
}

export const getTags = (
  tags: CommandInteractionOption<CacheType> | null
): string[] => {
  return tags?.value
    ?.toString()
    .split(/\s+/)
    .map((tag) => tag.trim().toLowerCase()) as string[];
};

export const getSaveBuildAttributes = (
  interaction: ChatInputCommandInteraction<CacheType>
): ISaveBuildAttributes => {
  const file = interaction.options.getAttachment(
    SaveBuildAttributes.ATTACH
  ) as Attachment;
  const buildName = interaction.options.get(
    SaveBuildAttributes.BUILD_NAME
  ) as CommandInteractionOption<CacheType>;
  const tags = interaction.options.get(
    SaveBuildAttributes.TAGS
  ) as CommandInteractionOption<CacheType>;

  return {
    file,
    buildName,
    tags,
  };
};

export const getTagNames = (tags: Tag[]): string[] =>
  tags.map(({ name }) => name);

export const getNonRepeated = (
  allData: string[],
  searchData: string[]
): string[] => searchData.filter((s) => allData.indexOf(s) === -1);

export const getRepeated = (allData: Tag[], searchData: string[]): Tag[] =>
  allData.filter(({ name }) => searchData.indexOf(name) !== -1);

export const saveTags = async (tags: string[]): Promise<Tag[]> => {
  const newTags: Tag[] = [];

  for (const tag of tags) {
    const newTag = new Tag();
    newTag.name = tag;

    await newTag.save();

    newTags.push(newTag);
  }

  return newTags;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAllTags = async (filter = {}): Promise<Tag[]> => {
  const tags = await Tag.find(filter);

  return tags;
};

export const getTagsAutoComplete = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter: any
): Promise<AutoComplete[]> => {
  const tags = await getAllTags(filter);

  return tags.map(({ name, id }) => ({
    name,
    value: id.toString(),
  }));
};

export const embedBuildsFromTags = async (
  interaction: ChatInputCommandInteraction<CacheType>,
  tag: Tag
): Promise<void> => {
  const ids: number[] = [];
  const embedBuilds = tag.builds.filter(({ id }) => {
    if (ids.indexOf(id) === -1) {
      ids.push(id);

      return true;
    }

    return false;
  });
  const allEmbedBuilds: AttachmentBuilder[] = [];

  for (const { id } of embedBuilds) {
    const buildImagePath = generatePath(
      __dirname,
      '..',
      Upload.DIRECTORY,
      id.toString()
    );
    const img = (await jimp.read(buildImagePath))
      .resize(ImageOpts.RESOLUTION, jimp.AUTO)
      .quality(ImageOpts.SIZE);
    const fileContent = await img.getBufferAsync(img.getMIME());
    const attachment = new AttachmentBuilder(fileContent);

    allEmbedBuilds.push(attachment);
  }

  await interaction.editReply({ files: allEmbedBuilds });
};
