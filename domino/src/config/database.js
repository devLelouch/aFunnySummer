const pg = require('pg');

    var conString = "postgres://Angel:4071995@localhost:8080/Domino";
    var client = new pg.Client(conString);
   client.connect((err) => {
  if(err)
  {
    console.log('no se puede abrir la base de datos');
  }
});
    module.exports = client;






  /*  pg.connect(conString, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('SELECT $1::int AS number', ['1'], function(err, result) {
    //call `done()` to release the client back to the pool
    done();

    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].number);
    //output: 1
  });
});*/