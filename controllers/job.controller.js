const ResourceNotFoundError = require("../data/errors/ResourceNotFoundError");
const Job = require("../models/job.model");

/**
 * @typedef {Object} DBActionResponse
 * @property {string} message - DB action status
 * @property {Project|void} [project]
 * @property {Error} [error]
 */

module.exports = class JobController {
	static async #createJob(jobData) {
		const job = new Job(jobData);
		try {
			const result = await job.save();
			return {
				message: "Job created successfully",
				job: result
			};
		} catch (err) {
			return {
				message: "Failed to create Job",
				error: err.original || err
			};
		};
	}
	static async #updateJob(jobId, updateOptions) {
		const job = await Job.findOne({
			where: {
				id: jobId
			}
		});
		try {
			if (job === null) throw new ResourceNotFoundError({
				resourceType: "Job",
				searchParameters: {
					id: jobId
				}
			});
			for (const key in updateOptions) job.setDataValue(key, updateOptions[key]);
			const result = await job.save();
			return {
				message: "Job updated successfully",
				job: result
			};
		} catch (err) {
			return {
				message: "Failed to update Job",
				error: err.original || err
			};
		};
	}
	static async #deleteJob(jobId) {
		const job = await Job.findOne({
			where: {
				id: jobId
			}
		});
		try {
			if (job === null) throw new ResourceNotFoundError({
				resourceType: "Job",
				searchParameters: {
					id: jobId
				}
			});
			const result = await job.destroy();
			return {
				message: "Job deleted successfully",
				job: result
			};
		} catch (err) {
			return {
				message: "Failed to delete Job",
				error: err.original || err
			};
		};
	}
	static async getAllJobs() {
		return await Job.findAll({
			order: [
				["startDate", "DESC"]
			]
		});
	}
	static async getJob(searchParameters) {
		return await Job.findOne({
			where: searchParameters
		});
	}
	static async getJobs(searchParameters) {
		return await Job.findAll({
			where: searchParameters
		});
	}
	static async getJobById(jobId) {
		return await JobController.getJob({
			id: jobId
		});
	}
	static async getJobsByTitle(jobTitle) {
		return await JobController.getJobs({
			title: jobTitle,
			order: [
				["startDate", "DESC"]
			]
		});
	}
	static async getJobsByCompany(companyName) {
		return await JobController.getJobs({
			company: companyName,
			order: [
				["startDate", "DESC"]
			]
		});
	}
	static async getJobByCompanyAndTitle(companyName, jobTitle) {
		return await JobController.getJob({
			company: companyName,
			title: jobTitle
		});
	}
	static async getLatestJobs() {
		return await Job.findAll({
			order: [
				["startDate", "DESC"]
			],
			limit: 5
		});
	}
	static async createJob(jobData) {
		const result = await JobController.#createJob(jobData);
		if (result.error) throw result.error;
		else return result.message;
	}
	static async updateJob(jobId, updateOptions) {
		const result = await JobController.#updateJob(jobId, updateOptions);
		if (result.error) throw result.error;
		else return result.message;
	}
	static async deleteJob(jobId) {
		const result = await JobController.#deleteJob(jobId);
		if (result.error) throw result.error;
		else return result.message;
	}
	static async verifyJob(jobId) {
		return (await JobController.getJobById(jobId)) instanceof Job ? true : false;
	}
};