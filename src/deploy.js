const path = require('path')
const fs = require('fs').promises
// eslint-disable-next-line import/no-extraneous-dependencies
const glob = require('glob')
const axios = require('axios')
const {
  env: { isDev, isProd, isTest },
  deployInDev,
  deployInfo,
  endpoints: { agentsDeploy, reportError },
} = require('./config')

const distFolder = path.resolve(__dirname, '..', 'dist')

function generateUploadInfoComment() {
  const date = new Date()
  const uploadedString = `${date.toISOString()}\n${date.toString()}`
  const longestDeployKeyLength = Object.keys(deployInfo).sort(
    (a, b) => b.length - a.length,
  )[0].length
  const deployString = Object.keys(deployInfo)
    .map(key => {
      const spaces = ' '.repeat(longestDeployKeyLength - key.length + 2)
      return `${key}:${spaces}${deployInfo[key]}`
    })
    .reduce((fullString, line) => `${fullString}\n${line}`, '')
  const infoComment = ['/*', uploadedString + deployString, '*/'].join('\n')
  return [infoComment, date.toString()]
}

function agentPathToName(agentPath) {
  const splitted = agentPath.replace('.js', '').split('/')
  return `${splitted[splitted.length - 1]}`
}

async function deployAgents() {
  const [, , ...agentsToDeploy] = process.argv

  let agentsPaths = glob.sync(`${distFolder}/*.js`)
  if (agentsToDeploy.length > 0) {
    agentsPaths = agentsPaths.filter(agentPath =>
      agentsToDeploy.includes(agentPathToName(agentPath)),
    )
  }
  // eslint-disable-next-line no-console
  console.log(
    `Deploying\n  - ${agentsPaths.map(agentPathToName).join('\n  - ')}`,
  )
  const [uploadInfoComment, date] = generateUploadInfoComment()
  const agentsInfo = await Promise.all(
    agentsPaths.map(async agentPath => {
      const rawAgentCode = await fs.readFile(agentPath, 'utf-8')
      const agentName = `js_${agentPathToName(agentPath)}`
      const agentCode = `${uploadInfoComment}\n${rawAgentCode}`
      return { agentName, agentCode }
    }),
  )

  try {
    if (isProd || isTest || (isDev && deployInDev)) {
      const { data } = await axios.post(agentsDeploy, {
        body: { date, deployInfo, agentsInfo },
      })
      console.log(data) // eslint-disable-line no-console
    }
  } catch (error) {
    console.error(`Error: ${error.message}`) // eslint-disable-line no-console
    const text = `Error deploying js agents\n${error.message}`
    await axios.post(reportError, { error: { text } })
  }
}

deployAgents()
