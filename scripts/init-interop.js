(async function () {
  const { readFile: _readFile, writeFile } = require('fs');
  const { join } = require('path');
  const { promisify } = require('util');
  const { enableDevTools, devToolsMode, getSlackStaticDirectory } = require('./config');
  
  const staticFile = await getSlackStaticDirectory();

  const readFile = promisify(_readFile);  
  let interop = (await readFile(join(staticFile, 'ssb-interop.js'))).toString();

  let begin = interop.indexOf('// %SLACK_DISCORD_THEME_BEGIN%');
  let end = interop.indexOf('// %SLACK_DISCORD_THEME_END%');

  if (begin !== -1 && end !== -1) {
    begin -= 2;
    end += 28;
    interop = interop.substr(0, begin) + interop.substr(end, interop.length - end);
  }

  let interopMod = await readFile(join(__dirname, '..', 'resources', 'ssb-interop-mod.txt'));
  interopMod = interop + interopMod.toString()
    .replace('%SLACK_DEV_TOOLS%', enableDevTools)
    .replace('%SLACK_DEV_TOOLS_MODE%', devToolsMode)
    .replace('%SLACK_ROOT%', staticFile.replace(/\\/g, '\\\\'))
    .replace('%SLACK_CSS_FILENAME%', 'main.css');

  await promisify(writeFile)(join(staticFile, 'ssb-interop.js'), interopMod);
})();
