(async function() {
  const { join } = require('path');
  const fs = require('fs-extra');
  const { getSlackStaticDirectory } = require('./config');

  fs.copy(
    join(__dirname, '..', 'out', 'main.css'),
    join(await getSlackStaticDirectory(), 'main.css')
  );
})();
