const { Pool } = require('pg')

async function connectToDB(queryString) {
    return new Promise((resolve, reject) => {    
      const pool = new Pool({
        user: "yonfyhumjwmnhj",
        host: "ec2-18-214-140-149.compute-1.amazonaws.com",
        database: "d3pb8hr586qo9h",
        password: "472968e385e2bc379e8d4de483dfe9db72080ccf726961cb2640386d7f74ed1e",
        port: 5432
      })
      pool.connect((err, client, release) => {
        if (err ) {
          reject(err)
        }
        if (!client) {
          reject("No client")
        }
        client.query(queryString, (err, result) => {
          release()
          if (err) {
            reject(err)
          }
          else {
            resolve(result)
          }
        })
      })
    })
  }

module.exports = connectToDB;