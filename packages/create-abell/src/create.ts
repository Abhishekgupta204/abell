import {
  getInstallCommand,
  getProjectInfo,
  getTemplate,
  scaffoldTemplate,
  setNameInPackageJSON
} from './steps';
import { colors, deleteDir, log, relative, run } from './utils';

export type CreateAbellOptions = {
  installer?: 'npm' | 'yarn' | 'pnpm' | 'bun';
  template?: string;
};

async function create(
  projectNameArg: string | undefined,
  options: CreateAbellOptions
): Promise<void> {
  // 1. Get all the required project information
  const { projectDisplayName, projectPath } =
    await getProjectInfo(projectNameArg);
  const relProjectPath = relative(projectPath);
  const template = getTemplate(options.template);
  const installCommand = await getInstallCommand(options.installer);

  // 2. Scaffold Project
  console.log('');
  log.info(
    `Scaffolding ${colors.bold(relProjectPath)} using  ${colors.bold(
      template
    )} template`,
    1
  );

  await scaffoldTemplate({
    projectPath,
    template
  });

  console.log('');
  log.info(`Running ${colors.bold(installCommand)}`, 2);
  // 3. Install Dependencies
  try {
    await run(installCommand, {
      cwd: projectPath
    });
  } catch (err) {
    log.failure(`Could not install dependencies. Skipping ${installCommand}`);
  }

  // 4. Set name in project's package.json
  setNameInPackageJSON(`${projectPath}/package.json`, projectDisplayName);

  // 5. Delete `.git` (For projects scaffolded from github)
  deleteDir(`${projectPath}/.git`);

  // 6. Log Success
  log.success(`${projectDisplayName} scaffolded successfully 🚀\n`);
  let runCommand = 'npm run dev';
  if (installCommand === 'yarn') {
    runCommand = 'yarn dev';
  } else if (installCommand === 'pnpm install') {
    runCommand = 'pnpm run dev';
  } else if (installCommand === 'bun install') {
    runCommand = 'bun run dev';
  }

  log.info(
    `${colors.bold(`cd ${relProjectPath}`)} and run ${colors.bold(
      runCommand
    )} to run the dev-server\n`
  );
}

export default create;
