# Slack Discord Theme
For those who share my love of Discord's dark theme.

**_Note: Windows only!_**

# Setup
Simply run `node setup.js`. This will inject the `scripts/ssb-interop.js` file
into Slack's electron startup script. The script sets Slack's styling, and also
enables the developer console.

If you do not want the developer tools enabled, set `enableDevTools` to false in
`setup.js`. The script is only injected the first time `setup.js` is ran, so if 
you've already ran `setup.js`, you'll have to navigative to Slack's startup script
and change it manually. The file is located at 
`%LOCALAPPDATA%/slack/app.X.Y.Z/resources/app.asar.unpacked/src/static/ssb-interop.js`.

*Note: Always modify the latest version of slack*

In addition to modifying the startup script, `setup.js` also started a SASS watcher.
When you edit any files inside of the `scss/` directory, they will be automatically
recompiled, and slack will re-open to apply changes.

*TODO: Figure out how to refresh slack instead of restarting it*.

# Credit
The SASS code was initially pulled from [laCour's slack-night-mode theme](https://github.com/laCour/slack-night-mode/) 
and modified.

The `ssb-interop.js` file trick and most code in `ssb-interop-mod.js` was taken at large
from [this github gist](https://gist.github.com/DrewML/0acd2e389492e7d9d6be63386d75dd99#gistcomment-2021885)