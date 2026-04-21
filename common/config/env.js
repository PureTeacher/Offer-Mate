// prod-生产 dev-开发 local-本地
const env = "local"

// const prod = {
// baseUrl: 'http://localhost:9001/alibaba-ai/v1', // 生产环境'
// }
// const dev = {
// baseUrl: 'http://localhost:7001/alibaba-ai/v1', // 开发环境'
// }
// const local = {
// baseUrl: 'http://localhost:8001/alibaba-ai/v1', // 本地环境'
// }

const prod = {
baseUrl: 'http://47.94.217.78:7001/alibaba-ai/v1', // 生产环境'
}
const dev = {
baseUrl: 'http://47.94.217.78:7001/alibaba-ai/v1', // 开发环境'
}
const local = {
baseUrl: 'http://47.94.217.78:7001/alibaba-ai/v1', // 本地环境'
}

const config = {
dev,
prod,
local,
}

export default config[env]
