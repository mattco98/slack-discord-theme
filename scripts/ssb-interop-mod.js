

document.addEventListener("DOMContentLoaded", function() {
  const root = '%SLACK_ROOT%';

  if (%SLACK_DEV_TOOLS%) {
    require('electron').remote.getCurrentWebContents().openDevTools({ mode: '%SLACK_DEV_TOOLS_MODE%' });
  }

  // Then get its webviews
  let webviews = document.querySelectorAll(".TeamView webview");

  // Fetch our CSS in parallel ahead of time
  const cssPath = 'https://raw.githubusercontent.com/angelsix/youtube/develop/Windows%2010%20Dark%20Theme/Slack/slack-dark.css';
  let cssPromise = fetch(cssPath).then(response => response.text());

  const customCSS = require('fs').readFileSync(root + '/resources/app.asar.unpacked/src/static/%SLACK_CSS_FILENAME%');

  // Insert a style tag into the wrapper view
  cssPromise.then(css => {
     let s = document.createElement('style');
     s.type = 'text/css';
     s.innerHTML = css + customCSS;
     document.head.appendChild(s);
  });

  // Wait for each webview to load
  webviews.forEach(webview => {
     webview.addEventListener('ipc-message', message => {
        if (message.channel == 'didFinishLoading')
           // Finally add the CSS into the webview
           cssPromise.then(css => {
              let script = `
                    let s = document.createElement('style');
                    s.type = 'text/css';
                    s.id = 'slack-custom-css';
                    s.innerHTML = \`${css}\`;
                    document.head.appendChild(s);
                    `
              webview.executeJavaScript(script);
           })
     });
  });
}); // %SLACK_DISCORD_THEME%