import {
  CacheType,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from 'discord.js';
import { saveBuild } from '../utils/build';
import { Command } from '../enums/commands.enum';
import { Response } from '../enums/response.enum';
import { SaveBuildAttributes } from '../enums/save-build-attributes.enum';
import {
  getTags,
  saveTags,
  getAllTags,
  getRepeated,
  getTagNames,
  getNonRepeated,
  getSaveBuildAttributes,
} from '../utils/tags';
import { downloadAndSave } from '../utils/file';

export default {
  data: new SlashCommandBuilder()
    .setName(Command.SAVE_BUILD)
    .setDescription(Command.SAVE_BUILD_DESCRIPTION)
    .addAttachmentOption((option) =>
      option
        .setName(SaveBuildAttributes.ATTACH)
        .setDescription(SaveBuildAttributes.ATTACH_DESCRIPTION)
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName(SaveBuildAttributes.BUILD_NAME)
        .setDescription(SaveBuildAttributes.BUILD_NAME_DESCRIPTION)
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName(SaveBuildAttributes.TAGS)
        .setRequired(true)
        .setDescription(SaveBuildAttributes.TAGS_DESCRIPTION),
    ),

  async execute(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    const {
      file,
      buildName: { value: buildValue },
      tags,
    } = getSaveBuildAttributes(interaction);
    const tagsValue = getTags(tags);
    const allTags = await getAllTags();
    const allTagsNames = getTagNames(allTags);
    const nonRepeatedTags = getNonRepeated(allTagsNames, tagsValue);
    const repeatedTags = getRepeated(allTags, tagsValue);
    let newTags = await saveTags(nonRepeatedTags);

    newTags = [...newTags, ...repeatedTags];

    const createdBuild = await saveBuild({
      name: buildValue as string,
      fileUrl: file?.url as string,
      tags: newTags,
    });

    await interaction.editReply(Response.BUILD_SAVED);

    await downloadAndSave(createdBuild.id.toString(), file.url);
  },
};
