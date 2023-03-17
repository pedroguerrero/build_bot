import * as dotenv from 'dotenv';

dotenv.config();

import { REST, Routes } from 'discord.js';
import { commands } from './commands';

(async () => {
  const {
    env: { TOKEN, CLIENT_ID },
  } = process;

  const rest = new REST({ version: '10' }).setToken(TOKEN || '');

  try {
    console.log('Started refreshing application (/) commands.');

    const registerCommands = [];

    for (const commandName in commands) {
      console.log(`Loading command: ${commandName}`);

      const command =
        commands[commandName as keyof typeof commands].data.toJSON();

      registerCommands.push(command);
    }

    await rest.put(Routes.applicationCommands(CLIENT_ID || ''), {
      body: registerCommands,
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
