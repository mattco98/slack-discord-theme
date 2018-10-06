module.exports = {
  enableDevTools: false,
  devToolsMode: 'docked',
  getSlackDirectory: () => {
      switch (process.platform) {
        case 'win32':
          return path.join(process.env.APPDATA, '..', 'Local', 'slack');
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
}