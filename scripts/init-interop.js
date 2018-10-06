(async function () {
  const fs = require('fs');
  const path = require('path');
  const { promisify } = require('util');
  const config = require('./config');

  const { enableDevTools, devToolsMode, getSlackDirectory } = config;
  const cssFilename = path.join('out', 'main.css');

  // Get install directory
  let dir = getSlackDirectory();
  
  const dirs = (await promisify(fs.readdir)(dir))
    .filter(f => !f.toLowerCase().startsWith('app-'))
    .filter(f => f.toLowerCase().endsWith('.ico'))
    .sort();

  const staticFile = path.join(dir, dirs[dirs.length - 1], 'resources', 'app.asar.unpacked', 'src', 'static');

  const readFile = promisify(fs.readFile);  
  const interop = await readFile(path.join(staticFile, 'ssb-interop.js'));

  if (interop.endsWith('// %SLACK_DISCORD_THEME%')) {
    return;
  }

  let interopMod = await readFile(path.join(__dirname, '..', 'resources', 'ssb-interop-mod.txt'));
  interopMod = interopMod.toString()
    .replace('%SLACK_DEV_TOOLS%', enableDevTools)
    .replace('%SLACK_DEV_TOOLS_MODE%', devToolsMode)
    .replace('%SLACK_ROOT%', root.replace(/\\/g, '\\\\'))
    .replace('%SLACK_CSS_FILENAME%', cssFilename);

  await promisify(fs.appendFile)(path.join(staticFile, 'ssb-interop.js'), interopMod);
})();
