const axios = require('axios')

module.exports = {
  Query: {
    legislators: async (obj, args, context, info) => {
      const legislators = await axios
        .get('https://dadosabertos.camara.leg.br/api/v2/deputados', {
          params: {
            ...args
          }
        })
        .then(response => response.data.dados)
        .catch(function(error) {
          console.log(error)
        })

      for (let i = 0; i < legislators.length; i += 1) {
        const legislatorComplementaryData = await axios.get(
          `https://dadosabertos.camara.leg.br/api/v2/deputados/${
            legislators[i].id
          }`
        )
        legislators[i] = {
          ...legislators[i],
          ...legislatorComplementaryData.data.dados
        }
      }

      return legislators
    }
  },
  Legislator: {
    partido({ siglaPartido: sigla }) {
      return axios
        .get('https://dadosabertos.camara.leg.br/api/v2/partidos', {
          params: {
            sigla
          }
        })
        .then(function(response) {
          return response.data.dados
        })
        .catch(function(error) {
          console.log(error)
        })
    }
  }
}
