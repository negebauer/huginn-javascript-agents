const path = require('path')
// eslint-disable-next-line import/no-extraneous-dependencies
const glob = require('glob')

const agentsFolder = path.resolve(__dirname, 'src', 'agents')

module.exports = {
  entry: glob
    .sync(`${agentsFolder}/*.js`)
    .filter(name => !name.includes('.test.'))
    .reduce(
      (acc, filePath) => ({
        ...acc,
        [filePath.replace(`${agentsFolder}/`, '')]: filePath,
      }),
      {},
    ),
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
}
