module.exports = (app, passport) => {
	app.get('/', (req,res) => {
		var user = null;
		if(req.isAuthenticated)
			var user = req.user;
		res.render("sala", {
			user: user
		});
	})
	app.get('/login', (req, res) => {
		res.render('login.ejs', {
			message: req.flash('loginMessage')
		});
	});
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}));
	app.get('/signup', (req,res) => {
		res.render('signup.ejs', {
			message: req.flash('signupMessage')
		});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true 
	}));

    app.get('/profile', isLoggedIn, (req, res) => {
		res.render('profile', {
			user: req.user
		});
	});

    app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});
    app.get('/article/:id', function(req , res){
		console.log(req.params.id);
		res.render('juego', {
			jug1: "angel",
			jug2: "pedro",
			tPartida: 1,
			tim: 60,
			ptmax: 100,
			apt: 0
        });
	  });
    app.get('/play/:id', (req,res) => {
		console.log(req.params);
		if(req.isAuthenticated){
            res.render('juego', {
				id: req.params,
				name: req.user
			});
		}
	});
}


function isLoggedIn (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}