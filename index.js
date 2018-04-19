const { GraphQLServer } = require('graphql-yoga')
const axios = require('axios')

const resolvers = {
  Query: {
    legislators: async (obj, args, context, info) => {
      const { nome, ordenarPor, siglaPartido } = args
      return axios
        .get(
          'https://dadosabertos.camara.leg.br/api/v2/deputados',
          {
            params: {
              nome,
              ordenarPor,
              siglaPartido
            }
          }
        )
        .then(function(response) {
          return response.data.dados
        })
        .catch(function(error) {
          console.log(error)
        })
    }
  },
  Legislator: {
    partido(args) {
      const sigla = args.siglaPartido;
      return axios
      .get(
        'https://dadosabertos.camara.leg.br/api/v2/partidos',
        {
          params: {
            sigla
          }
        }
      )
      .then(function(response) {
        return response.data.dados
      })
      .catch(function(error) {
        console.log(error)
      })
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
})

server.start(() => console.log('Server is running on http://localhost:4000'))
