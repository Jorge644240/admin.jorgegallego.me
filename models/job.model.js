const { marked } = require("marked");
const { DataTypes, Model } = require("sequelize");
const connection = require("../data/aws/dbConnection");

class Job extends Model {}

Job.init({
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
			if (this.getDataValue("id") && this.getDataValue("id")!==null) throw new Error("Cannot set Job ID after creation");
			else this.setDataValue("id", value);
		}
	},
	company: {
		type: DataTypes.STRING(100),
		allowNull: false,
		validate: {
			notEmpty: true,
			len: [5, 100]
		},
		set(value) {
			if (this.getDataValue("company") && this.getDataValue("companny")!==null) throw new Error("Cannot set Job Company Name after creation");
			else this.setDataValue("company", value);
		}
	},
	website: {
		type: DataTypes.STRING(100),
		allowNull: false,
		validate: {
			notEmpty: true,
			isUrl: true
		},
		set(newJobWebsite) {
			this.setDataValue("website", newJobWebsite);
		}
	},
	title: {
		type: DataTypes.STRING(100),
		allowNull: false,
		validate: {
			notEmpty: true
		},
		set(newJobTitle) {
			this.setDataValue("title", newJobTitle);
		}
	},
	summary: {
		type: DataTypes.STRING(150),
		allowNull: false,
		validate: {
			notEmpty: true,
			len: [10, 150]
		},
		set(newJobSummary) {
			this.setDataValue("summary", newJobSummary);
		}
	},
	description: {
		type: DataTypes.STRING(1500),
		allowNull: false,
		validate: {
			notEmpty: true,
			len: [50, 1500]
		},
		get() {
			return marked(this.getDataValue("description"));
		},
		set(newJobDescription) {
			this.setDataValue("description", newJobDescription);
		}
	},
	startDate: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW,
		validate: {
			isDate: true
		},
		set(value) {
			if (this.getDataValue("startDate") && this.getDataValue("startDate")!==null) throw new Error("Cannot set Job Start Year after creation");
			else this.setDataValue("startDate", value);
		}
	},
	endDate: {
		type: DataTypes.DATE,
		allowNull: true,
		validate: {
			isDate: true
		},
		set(value) {
			if (this.getDataValue("startDate") && this.getDataValue("startDate")>value) throw new Error("Job End Year cannot be before Job Start Year");
			else this.setDataValue("endDate", value);
		}
	},
	type: {
		type: DataTypes.ENUM({
			values: ["Full Time", "Part Time", "Freelance", "Contract", "Self Employed"]
		}),
		allowNull: false,
		defaultValue: "Full Time",
		validate: {
			notEmpty: true
		},
		set(value) {
			if (this.getDataValue("type") && this.getDataValue("type")!==null) throw new Error("Cannot set Job Type after creation");
			else this.setDataValue("type", value);
		}
	},
	name: {
		type: DataTypes.VIRTUAL,
		get() {
			return `${this.getDataValue("title")} - ${this.getDataValue("company")}`;
		},
		set(value) {
			throw new Error("Cannot set value of VIRTUAL property");
		}
	}
}, {
	sequelize: connection,
	tableName: "jobs",
	modelName: "Job",
	createdAt: false,
	updatedAt: false
});

module.exports = Job;