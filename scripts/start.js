const fs = require('fs');
const path = require('path');
const sass = require('node-sass');

const slack = path.join(__dirname, '..', 'out', 'slack');
const enableDevTools = true;
const devToolsMode = 'docked';
const cssFilename = 'main.css';

const getInstallDir = () => {
  let dir;

  switch (process.platform) {
    case 'win32':
      dir = path.join(process.env.APPDATA, '..', 'Local', 'slack');
      break;
    case 'darwin':
    case 'freebsd':
    case 'linux':
    case 'sunos':
    default:
      throw new Error('Your platform is not currently supported');
  }

  return dir;
}

const symlink = dir => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) reject(err);
      const dirs = [];
    
      files.forEach(f => {
        if (!f.toLowerCase().startsWith('app-') || f.toLowerCase().endsWith('.ico')) return;
        dirs.push(f);
      });
    
      const staticFile = path.join(
        path.join(dir, dirs.sort()[dirs.length - 1]) + path.sep, 
        'resources', 'app.asar.unpacked', 'src', 'static'
      );
    
      fs.symlink(staticFile, slack, 'junction', err => {
        if (err && !err.code === 'EEXIST') reject(err);
        else resolve(staticFile);
      });
    });
  });
};

const setInterop = root => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(slack, 'ssb-interop.js'), (err, contents) => {
      if (err) reject(err);

      if (!contents.toString().endsWith('// %SLACK_DISCORD_THEME%')) {
        fs.readFile(path.join(__dirname, 'ssb-interop-mod.js'), (err, mod) => {
          if (err) reject(err);
          
          mod = mod.toString()
                   .replace('%SLACK_DEV_TOOLS%', enableDevTools)
                   .replace('%SLACK_DEV_TOOLS_MODE%', devToolsMode)
                   .replace('%SLACK_ROOT%', root.replace(/\\/g, '\\\\'))
                   .replace('%SLACK_CSS_FILENAME%', cssFilename);

          fs.appendFile(path.join(slack, 'ssb-interop.js'), mod, err => {
            if (err) reject(err);
            else resolve();
          });
        });
      } else resolve();
    });
  });
};

symlink(getInstallDir())
  .then(setInterop)
  .catch(err => { if (err) throw err; });