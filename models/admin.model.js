const { DataTypes, Model } = require("sequelize");
const connection = require("../data/aws/dbConnection");
const hash = require("hash.js");

class Admin extends Model {};

Admin.init({
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull: false,
		unique: true,
		autoIncrement: true,
		primaryKey: true,
		validate: {
			notEmpty: true,
			isInt: true
		},
		set(value) {
			if (this.getDataValue("id") && this.getDataValue("id")!==null) throw new Error("Cannot set Admin ID after creation");
			else this.setDataValue("id", value);
		}
	},
	username: {
		type: DataTypes.STRING(50),
		allowNull: false,
		unique: true,
		validate: {
			notEmpty: true
		},
		set(value) {
			if (this.getDataValue("username") && this.getDataValue("username")!==null) throw new Error("cannto set Admin Username after creation");
			else this.setDataValue("username", value);
		}
	},
	password: {
		type: DataTypes.STRING(150),
		allowNull: false,
		defaultValue: hash.sha512().update(process.env.DEFAULT_ADMIN_PASS.concat(process.env.ADMIN_PASS_SALT)).digest("hex"),
		validate: {
			notEmpty: true
		},
		set(newPass) {
			this.setDataValue("password", newPass);
		}
	}
}, {
	sequelize: connection,
	tableName: "admins",
	modelName: "Admin",
	createdAt: "dateCreated",
	updatedAt: false
});

module.exports = Admin;