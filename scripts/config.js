const { join } = require('path');
const { promisify } = require('util');
const { readdir } = require('fs');

const getSlackDirectory = () => {
  switch (process.platform) {
    case 'win32':
      return join(process.env.APPDATA, '..', 'Local', 'slack');
    case 'aix':
    case 'android':
    case 'cygwin':
    case 'darwin':
    case 'freebsd':
    case 'linux':
    case 'openbsd':
    case 'sunos':
    default:
      throw new Error('Your platform is not currently supported');
  }
} 

const getSlackStaticDirectory = async () => {
  let dir = getSlackDirectory();
  
  const dirs = (await promisify(readdir)(dir))
    .filter(f => f.toLowerCase().startsWith('app-'))
    .filter(f => !f.toLowerCase().endsWith('.ico'))
    .sort();

  return join(dir, dirs[dirs.length - 1], 'resources', 'app.asar.unpacked', 'src', 'static');
}

module.exports = {
  enableDevTools: false,
  devToolsMode: 'docked',
  getSlackStaticDirectory
}