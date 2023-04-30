import http from 'node:http'
import { json } from './middleware/json.js'
import { routes } from './routes.js'
import { buildPathPattern } from './utils/build-path-pattern.js'

const server = http.createServer(async (req, res) => {


  await json(req, res)
  routes.forEach(route => route.pathPattern = buildPathPattern(route.path))

  const { method, url } = req
  const route = routes.find(route => route.method === method && route.pathPattern.test(url))

  if (route) {
    req.params = url.match(route.pathPattern).groups
    return route.handler(req, res)
  }
  return res.writeHead(404).end()
})

server.listen(process.env.PORT || 3000)