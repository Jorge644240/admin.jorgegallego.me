const { marked } = require("marked");
const { DataTypes, Model } = require("sequelize");
const connection = require("../data/aws/dbConnection");

class Project extends Model {}

Project.init({
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
		unique: true,
		validate: {
			isInt: true,
			notEmpty: true
		},
		set(value) {
			if (this.getDataValue("id") && this.getDataValue("id")!==null) throw new Error("Cannot set Project ID after creation");
			else this.setDataValue("id", value);
		}
	},
	name: {
		type: DataTypes.STRING(100),
		allowNull: false,
		unique: true,
		validate: {
			notEmpty: true,
			len: [5, 100]
		},
		set(value) {
			if (this.getDataValue("name") && this.getDataValue("name")!==null) throw new Error("Cannto set Project Name after creation");
			else this.setDataValue("name", value);
		}
	},
	description: {
		type: DataTypes.STRING(500),
		allowNull: false,
		validate: {
			notEmpty: true,
			len: [50, 500]
		},
		get() {
			if (this.getDataValue("description")) return marked(this.getDataValue("description"));
			else return undefined;
		},
		set(newProjectDescription) {
			this.setDataValue("description", newProjectDescription);
		}
	},
	url: {
		type: DataTypes.STRING(100),
		allowNull: false,
		validate: {
			notEmpty: true,
			isUrl: true
		},
		set(newProjectUrl) {
			this.setDataValue("url", newProjectUrl);
		}
	},
	image: {
		type: DataTypes.STRING(150),
		allowNull: false,
		validate: {
			notEmpty: true,
			isUrl: true
		},
		set(newProjectImageUrl) {
			if (new URL(newProjectImageUrl).host !== "s3.amazonaws.com") throw new Error("Project Image URL must be an AWS S3 object");
			else if (!(new URL(newProjectImageUrl).pathname.startsWith("/jorgegallego.me"))) throw new Error("Project Image URL must be of AWS S3 bucket 'jorgegallego.me'");
			else this.setDataValue("image", newProjectImageUrl);
		}
	},
	featured: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
		set(value) {
			if (this.getDataValue("featured") && this.getDataValue("featured")!==null) throw new Error("Cannot set Project Featured Status after creation");
			else this.setDataValue("featured", new Boolean(value).valueOf());
		}
	}
}, {
	sequelize: connection,
	tableName: "projects",
	modelName: "Project",
	createdAt: false,
	updatedAt: false
});

module.exports = Project;