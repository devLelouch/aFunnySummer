const LocalStrategy = require ('passport-local').Strategy;
const client=require('../config/database.js');
const bcrypt = require('bcrypt-nodejs');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user);
	});
	passport.deserializeUser(function (id,done) {  
        client.query("SELECT * FROM ldata WHERE usuario = $1 ", [id.usuario], (err, res) => {
            done(err,res.rows[0]);
        }); 
	});

// Signup
  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function (req, usuario, password, done) {
    client.query("SELECT * FROM ldata WHERE usuario = $1 ", [usuario], function (err, user) {
      if (err) {
        return done(err);
      }
      if (user.rows.length) {
        return done(null, false, req.flash('signupMessage', 'the username is already taken'));
      }else{
        //Welcome to the callback hell muahahah 
            client.query("INSERT INTO ldata (usuario, password) VALUES ($1, $2)",[usuario,{password: encrypta(password)}], (err,result) => {
                if(err){
                    return done(null, false, req.flash('signupMessage', err));          
            }
            var obj = {
              usuario: usuario,
              password: encrypta(password)
            }
            return done(null, obj);
            });
        }
    }) 
}));

  // login
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function (req, email, password, done) {
    client.query("SELECT * FROM ldata WHERE usuario = $1 ", [email], function (err, user) {
      if(err) {
        done(err,null,req.flash('loginMessage','error de database'));
      }
      else if(!user.rows.length) {
        done(err,null,req.flash('loginMessage','El usuario no se encuentra registrado'));
      }
      else if((!bcrypt.compareSync(password, user.rows[0].password.password))) {
        done(err,null,req.flash('loginMessage','Contraseña incorrecta'));
      }
      else {
        done(err,user.rows[0]);
}
    });
  }));

}


 function encrypta(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

 function decrypta(password1,password2) {
  return bcrypt.compareSync(password, this.local.password);
};
  