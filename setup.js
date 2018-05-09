if (process.platform !== 'win32') return;

/*
 * Script Setup
 */

const fs = require('fs');
const path = require('path');
const root = path.join(process.env.APPDATA, '..', 'Local', 'slack');
const enableDevTools = true;
const devToolsMode = 'docked';
const cssFilename = 'main.css';

const restartSlack = () => {
  const childProcess = require('child_process');

  childProcess.exec('TASKKILL /IM slack.exe /F', (err, stdout, stderr) => {
    if (err && !err.message.contains('The process "slack.exe" not found.')) throw err;
    if (stderr) throw stderr;

    childProcess.execFile(path.join(root, 'slack.exe'));
  });
};

fs.readdir(root, (err, files) => {
  if (err) throw err;
  const dirs = [];

  files.forEach(f => {
    if (!f.toLowerCase().startsWith('app-') || f.toLowerCase().endsWith('.ico')) return;
    dirs.push(f);
  });

  const staticFile = path.join(
    path.join(root, dirs.sort()[dirs.length - 1]) + path.sep, 
    'resources', 'app.asar.unpacked', 'src', 'static'
  );

  const slack = path.join(__dirname, 'out', 'slack');


  fs.symlink(staticFile, slack, 'junction', err => {
    if (err && !err.code === 'EEXIST') throw err;

    fs.readFile(path.join(slack, 'ssb-interop.js'), 'utf8', (err, file) => {
      if (err) throw err;

      if (!file.endsWith('// %SLACK_DISCORD_THEME%')) {
        // Get injection code
        fs.readFile(path.join(__dirname, 'scripts', 'ssb-interop-mod.js'), 'utf8', (err, file) => {
          if (err) throw err;

          file = file.replace('%SLACK_DEV_TOOLS%', enableDevTools)
                    .replace('%SLACK_DEV_TOOLS_MODE%', devToolsMode)
                    .replace('%SLACK_ROOT%', staticFile.replace(/\\/g, '\\\\'))
                    .replace('%SLACK_CSS_FILENAME%', cssFilename);
          fs.appendFile(path.join(slack, 'ssb-interop.js'), file, (err) => { if (err) throw err });

          restartSlack();
        })
      };
    });
  });
});