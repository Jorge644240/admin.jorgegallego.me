const { sign } = require("jsonwebtoken");
const ResourceNotFoundError = require("../data/errors/ResourceNotFoundError");
const Admin = require("../models/admin.model");

class AdminController {
	static async #createAdmin(adminData) {
		const admin = new Admin(adminData);
		try {
			const result = await admin.save();
			return {
				message: "Admin created successfully",
				admin: result
			};
		} catch (err) {
			return {
				message: "Failed to create Admin",
				error: err.original || err
			};
		};
	}
	static async #updateAdmin(adminUsername, updateOptions) {
		const admin = await Admin.findOne({
			where: {
				username: adminUsername
			}
		});
		try {
			if (admin === null) throw new ResourceNotFoundError({
				resourceType: "Admin",
				searchParameters: {
					username: adminUsername
				}
			});
			for (const key in updateOptions) admin.setDataValue(key, updateOptions[key]);
			const result = await admin.save();
			return {
				message: "Admin updated successfully",
				admin: result
			};
		} catch (err) {
			return {
				message: "Failed to update Admin",
				error: err.orignal || err
			};
		};
	}
	static async #deleteAdmin(adminUsername) {
		const admin = await Admin.findOne({
			where: {
				username: adminUsername
			}
		});
		try {
			if (admin === null) throw new ResourceNotFoundError({
				resourceType: "Admin",
				searchParameters: {
					username: adminUsername
				}
			});
			const result = await admin.destroy();
			return {
				message: "Admin deleted successfully",
				admin: result
			};
		} catch (err) {
			return {
				message: "Failed to delete Admin",
				error: err.orignal || err
			};
		}
	}
	static async createAdmin(adminData) {
		const result = await AdminController.#createAdmin(adminData);
		if (result.error) throw result.error;
		else return result;
	}
	static async updateAdmin(adminUsername, updateOptions) {
		const result = await AdminController.#updateAdmin(adminUsername, updateOptions);
		if (result.error) throw result.error;
		else return result;
	}
	static async deleteAdmin(adminUsername) {
		const result = await AdminController.#deleteAdmin(adminUsername);
		if (result.error) throw result.error;
		else return result;
	}
	static async getAllAdmins() {
		return await Admin.findAll();
	}
	static async getAdmin(searchParameters) {
		return await Admin.findOne({
			where: searchParameters
		});
	}
	static async getAdminById(adminId) {
		return AdminController.getAdmin({ id:adminId });
	}
	static async getAdminByUsername(adminUsername) {
		return await AdminController.getAdmin({ username:adminUsername });
	}
	static async logInAdmin(adminData) {
		try {
			const admin = await AdminController.getAdminByUsername(adminData.username);
			if (admin) {
				if (admin.password === adminData.password) {
					return {
						message: "Successfully logged in Admin",
						token: AdminController.createAdminToken({
							id: admin.id,
							username: admin.username
						})
					};
				} else {
					return {
						message: "Incorrect username and/or password",
						error: "Incorrect username and/or password",
					};
				}
			} else {
				throw new ResourceNotFoundError({
					resourceType: "Admin",
					searchParameters: {
						username: adminData.username
					}
				});
			}
		} catch (err) {
			return {
				message: "Failed to log in Admin",
				error: err.original || err
			};
		};
	}
	static async verifyAdmin(adminUsername) {
		return (await AdminController.getAdminByUsername(adminUsername)) ? true : false;
	}
	static createAdminToken(adminData) {
		return sign(adminData, process.env.JWT_SIGNATURE, {
			issuer: "Jorge Gallego",
			audience: "Jorge Gallego",
			expiresIn: "1h"
		});
	}
};

module.exports = AdminController;