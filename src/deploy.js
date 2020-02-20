const path = require('path')
const fs = require('fs').promises
// eslint-disable-next-line import/no-extraneous-dependencies
const glob = require('glob')
const axios = require('axios')
const {
  env: { isDev, isProd, isTest },
  deployInfo,
  endpoints: { agentsDeploy, reportError },
} = require('./config')

const distFolder = path.resolve(__dirname, '..', 'dist')

function generateUploadInfoComment() {
  const uploadedString = `uploaded:\t${new Date()}`
  const deployString = Object.keys(deployInfo)
    .map(key => {
      const space = key.length <= 6 ? '\t\t' : '\t'
      return `${key}:${space}${deployInfo[key]}`
    })
    .reduce((fullString, line) => `${fullString}\n${line}`, '')
  // .trim()
  return ['/*', uploadedString + deployString, '*/'].join('\n')
}

function agentPathToName(agentPath) {
  const splitted = agentPath.replace('.js', '').split('/')
  return `js_${splitted[splitted.length - 1]}`
}

async function deployAgents() {
  const agentsPaths = glob.sync(`${distFolder}/*.js`)
  const uploadInfoComment = generateUploadInfoComment()
  const agentsData = await Promise.all(
    agentsPaths.map(async agentPath => {
      const rawAgentCode = await fs.readFile(agentPath, 'utf-8')
      const agentName = agentPathToName(agentPath)
      const agentCode = `${uploadInfoComment}\n${rawAgentCode}`
      return { agentName, deployInfo, agentCode }
    }),
  )

  try {
    if (isProd || isTest || isDev) {
      const { data } = await axios.post(agentsDeploy, { agentsData })
      console.log(data) // eslint-disable-line no-console
    } else if (isDev) {
      console.log(agentsData) // eslint-disable-line no-console
      console.log(`Post to ${agentsDeploy}`) // eslint-disable-line no-console
    }
  } catch (error) {
    const text = `Error deploying js agents\n${error.message}`
    await axios.post(reportError, { error: { text } })
  }
}

deployAgents()
