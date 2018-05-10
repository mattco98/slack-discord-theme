# Slack Discord Theme
For those who share my love of Discord's dark theme.

**_Note: Windows only!_**

# Setup
Simply run `npm start`. This will inject the `scripts/ssb-interop.js` 
file into Slack's electron startup script. The script sets Slack's 
styling, and also enables the developer console.

If you do not want the developer tools enabled, set `enableDevTools` to 
false in `scripts/start.js`. The script is only injected the first time 
`npm start` is ran, so if you've already ran `npm, start`, you'll have 
to navigative to Slack's startup script and change it manually. The file 
is located at `%LOCALAPPDATA%/slack/app.X.Y.Z/resources/app.asar.unpacked/src/static/ssb-interop.js`.

*Note: Always modify the latest version of slack*

In addition to modifying the startup script, `npm start` also starts a 
SASS watcher. When you edit any files inside of the `scss/` directory, 
they will be automatically recompiled. In order to see your changes,
you'll have to refresh Slack with `ctrl+r`.

# Credit
The SASS code was initially pulled from [laCour's slack-night-mode theme](https://github.com/laCour/slack-night-mode/) 
and modified.

The `ssb-interop.js` file trick and most code in `ssb-interop-mod.js` 
was taken at large from [this github gist](https://gist.github.com/DrewML/0acd2e389492e7d9d6be63386d75dd99#gistcomment-2021885)