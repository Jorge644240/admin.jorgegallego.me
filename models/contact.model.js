const { DataTypes, Model } = require("sequelize");
const connection = require("../data/aws/dbConnection");

class Contact extends Model {};

Contact.init({
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull: false,
		primaryKey: true,
		unique: true,
		autoIncrement: true,
		validate: {
			isInt: true,
			notEmpty: true
		},
		set(value) {
			throw new Error("Cannot set Contact ID");
		}
	},
	name: {
		type: DataTypes.STRING(150),
		allowNull: false,
		validate: {
			notEmpty: true
		},
		set(value) {
			throw new Error("Cannot set Contact Name");
		}
	},
	email: {
		type: DataTypes.STRING(300),
		allowNull: false,
		unique: true,
		validate: {
			notEmpty: true,
			isEmail: true
		},
		set(value) {
			throw new Error("Cannot set Contact Email");
		}
	},
	service: {
		type: DataTypes.ENUM({
			values: ["Front End", "Back End", "Full Stack", "Consultancy"]
		}),
		allowNull: false,
		validate: {
			notEmpty: true
		},
		set(value) {
			throw new Error("Cannot set Contact Service");
		}
	},
	message: {
		type: DataTypes.STRING(1000),
		allowNull: true,
		validate: {
			notEmpty: true
		},
		set(value) {
			throw new Error("Cannot set Contact Message");
		}
	}
}, {
	sequelize: connection,
	tableName: "contacts",
	modelName: "Contact",
	createdAt: false,
	updatedAt: false
});

module.exports = Contact;