if (process.platform !== 'win32') return;

/*
 * Script Setup
 */

const fs = require('fs');
const root = process.env.APPDATA + '\\..\\Local\\slack\\';
const enableDevTools = true;
const devToolsMode = 'docked';
const cssFilename = 'custom.css';

const getSlackDirectory = localSlack => {
  return new Promise((resolve, reject) => {
    fs.readdir(root, (err, files) => {
      if (err) reject(err);
      const dirs = [];

      files.forEach(f => {
        if (!f.toLowerCase().startsWith('app-') || f.toLowerCase().endsWith('.ico')) return;
        dirs.push(f);
      });

      resolve(localSlack + dirs.sort()[dirs.length - 1]);
    });
  });
};

const getInteropMod = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('./scripts/ssb-interop-mod.js', 'utf8', (err, file) => {
      if (err) reject(err)
      else resolve(file);
    })
  })
}

const restartSlack = () => {
  const childProcess = require('child_process');

  childProcess.exec('TASKKILL /IM slack.exe /F', (err, stdout, stderr) => {
    if (err) throw err;
    if (stderr) throw stderr;

    childProcess.execFile(root + 'slack.exe');
  });
}

getSlackDirectory(root)
  .then(dir => {
    const interopFile = dir + '\\resources\\app.asar.unpacked\\src\\static\\ssb-interop.js';
    fs.readFile(interopFile, 'utf8', (err, file) => {
      if (err) throw err;

      if (!file.endsWith('// %SLACK_DISCORD_THEME%')) {
        // Get injection code
        getInteropMod()
          .then(mod => {
            // Set dev tools options
            mod = mod.replace('%SLACK_DEV_TOOLS%', enableDevTools)
                     .replace('%SLACK_DEV_TOOLS_MODE%', devToolsMode)
                     .replace('%SLACK_ROOT%', dir.replace(/\\/g, '\\\\'))
                     .replace('%SLACK_CSS_FILENAME%', cssFilename);
            fs.appendFile(interopFile, mod, (err) => { if (err) throw err });

            restartSlack();
          })
          .catch(err => { throw err });
      };
    });
  })
  .catch(err => { throw err });



/*
 * SASS compiler/watcher
 */

const sass = require('node-sass');
const Watcher = require('node-sass-watcher');
const watcher = new Watcher('../scss/');

const compileSass = () => {
  getSlackDirectory(root)
    .then(dir => {
      const cssPath = dir + '\\resources\\app.asar.unpacked\\src\\static\\' + cssFilename;

      sass.render({
        file: './scss/main.scss'
      }, (err, result) => {
        if (err) throw err;
        fs.writeFile(cssPath, result.css, err => { if (err) throw err});
      });

      restartSlack();
    })
    .catch(err => { throw err });
};

watcher.on('init', compileSass);
watcher.on('update', compileSass);