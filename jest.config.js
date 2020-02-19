module.exports = {
  setupFiles: ['./config/jest-setup.js'],
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'test-results/jest' }],
  ],
}
