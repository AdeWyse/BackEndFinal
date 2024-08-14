const swaggerAutogen = require('swagger-autogen')()

output = './swagger_doc.json'
endpoints = ['./index.js']

const doc = {
  info: {
    version: '1.0',      // by default: '1.0.0'
    title: 'Api Musicaly',        // by default: 'REST API'
    description: 'API REST de música'
  }
}

swaggerAutogen(output, endpoints, doc)