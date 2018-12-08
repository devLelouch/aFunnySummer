const bcrypt = require('bcrypt-nodejs');
var userSchema = {
	Id: 0,
	usuario: "",
	email: "",
	password: ""
}

userSchema.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.validatePassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = userSchema;

/* const userSchema = new mongoose.Schema({
	local: {
		email: String,
		password: String
	}
})*/