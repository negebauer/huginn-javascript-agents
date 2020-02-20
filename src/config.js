const { execSync } = require('child_process')

const {
  CIRCLE_BRANCH = execSync('git rev-parse --abbrev-ref HEAD', {
    encoding: 'utf8',
  }).trim(),
  CIRCLE_BUILD_NUM = 'local',
  CIRCLE_BUILD_URL = 'local',
  CIRCLE_COMPARE_URL = 'local',
  CIRCLE_JOB = 'local',
  CIRCLE_PULL_REQUEST = 'local or no pr',
  CIRCLE_SHA1 = execSync('git rev-parse HEAD', {
    encoding: 'utf8',
  }).trim(),
  CIRCLE_USERNAME,
  HUGINN_HOST,
  HUGINN_USER,
  HUGINN_WEBHOOK_DEPLOY_AGENTS_ID,
  HUGINN_WEBHOOK_DEPLOY_AGENTS_PASSWORD,
  HUGINN_WEBHOOK_REPORT_ERROR_ID,
  HUGINN_WEBHOOK_REPORT_ERROR_PASSWORD,
  HOST,
  USER,
  NODE_ENV = 'development',
} = process.env

const isDev = NODE_ENV === 'development'
const isProd = NODE_ENV === 'production'
const isTest = NODE_ENV === 'test'

const config = {
  env: {
    isDev,
    isProd,
    isTest,
  },
  deployInfo: {
    username: CIRCLE_USERNAME || USER || HOST || 'local',
    commit: CIRCLE_SHA1,
    branch: CIRCLE_BRANCH,
    compareUrl: CIRCLE_COMPARE_URL,
    pullRequest: CIRCLE_PULL_REQUEST,
    buildUrl: CIRCLE_BUILD_URL,
    buildNumber: CIRCLE_BUILD_NUM,
    job: CIRCLE_JOB,
  },
  endpoints: {
    agentsDeploy: `${HUGINN_HOST}/users/${HUGINN_USER}/web_requests/${HUGINN_WEBHOOK_DEPLOY_AGENTS_ID}/${HUGINN_WEBHOOK_DEPLOY_AGENTS_PASSWORD}`,
    reportError: `${HUGINN_HOST}/users/${HUGINN_USER}/web_requests/${HUGINN_WEBHOOK_REPORT_ERROR_ID}/${HUGINN_WEBHOOK_REPORT_ERROR_PASSWORD}`,
  },
}

module.exports = config
