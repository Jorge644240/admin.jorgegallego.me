const { Op } = require("sequelize");
const Project = require("../models/project.model");
const ResourceNotFoundError = require("../data/errors/ResourceNotFoundError");
const { kebabCase } = require("lodash");
const s3Client = require("../data/aws/s3Client");

/**
 * @typedef {Object} DBActionResponse
 * @property {string} message - DB action status
 * @property {Project|void} [project]
 * @property {Error} [error]
 */

module.exports = class ProjectController {
	/**
	 * Creates new Project instance in DB
	 * @param {object} projectData 
	 * @param {string} projectData.name
	 * @param {string} projectData.description
	 * @param {string} projectData.url
	 * @param {string} projectData.image
	 * @param {boolean} projectData.featured
	 * @returns {Promise.<DBActionResponse>}
	 */
	static async #createProject(projectData) {
		const project = new Project(projectData);
		try {
			const result = await project.save();
			return {
				message: "Project created successfully",
				project: result
			};
		} catch (err) {
			return {
				message: "Failed to create Project",
				error: err.original || err
			};
		};
	}
	/**
	 * Updates existing Project instance in DB
	 * @param {string} projectId
	 * @param {object} updateOptions 
	 * @param {string} [updateOptions.name]
	 * @param {string} [updateOptions.description]
	 * @param {string} [updateOptions.url]
	 * @param {string} [updateOptions.image]
	 * @returns {Promise.<DBActionResponse>}
	 */
	static async #updateProject(projectId, updateOptions) {
		const project = await Project.findOne({
			where: {
				id: projectId
			}
		});
		try {
			if (project === null) throw new ResourceNotFoundError({
				resourceType: "Project",
				searchParameters: {
					id: projectId
				}
			});
			for (const key in updateOptions) project.setDataValue(key, updateOptions[key]);
			const result = await project.save();
			return {
				message: "Project updated successfully",
				project: result
			};
		} catch (err) {
			return {
				message: "Failed to update Project",
				error: err.original || err
			};
		};
	}
	/**
	 * Deletes Project instance from DB
	 * @param {string} projectId 
	 * @returns {Promise.<DBActionResponse>}
	 */
	static async #deleteProject(projectId) {
		const project = await Project.findOne({
			where: {
				id: projectId
			}
		});
		try {
			if (project === null) throw new ResourceNotFoundError({
				resourceType: "Project",
				searchParameters: {
					id: projectId
				}
			});
			const result = await project.destroy();
			return {
				message: "Project deleted successfully",
				project: result
			};
		} catch (err) {
			return {
				message: "Failed to delete Project",
				error: err.original || err
			};
		};
	}
	/**
	 * @param {object} projectData 
	 * @param {string} projectData.name
	 * @param {string} projectData.description
	 * @param {string} projectData.url
	 * @param {boolean} projectData.featured
	 * @param {Buffer} projectImageFile
	 * @throws Will throw an error if Project instance could not be created in DB
	 * @returns {Promise.<string>}
	 */
	static async createProject(projectData, projectImageFile) {
		projectData.image = `https://s3.amazonaws.com/jorgegallego.me/projects/${kebabCase(projectData.name)}.png`;
		const projectCreationPromisesResolvesArray = await Promise.all([
			s3Client.uploadFile(projectImageFile, {
				bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
				key: `projects/${kebabCase(projectData.name)}.png`
			}),
			ProjectController.#createProject(projectData)
		]);
		if (projectCreationPromisesResolvesArray[1].error) throw projectCreationPromisesResolvesArray[1].error;
		else return projectCreationPromisesResolvesArray[1].message;
	}
	/**
	 * @param {string} projectId
	 * @param {object} updateOptions 
	 * @param {string} [updateOptions.description]
	 * @param {string} [updateOptions.url]
	 * @param {Buffer} [projectImageFile]
	 * @throws Will throw an error if Project instance could not be updated
	 * @returns {Promise.<string>}
	 */
	static async updateProject(projectId, updateOptions, projectImageFile) {
		if (Buffer.isBuffer(projectImageFile)) {
			const project = await ProjectController.getProjectById(projectId);
			const projectUpdatePromisesResolvesArray = await Promise.all([
				s3Client.uploadFile(projectImageFile, {
					bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
					key: `projects/${kebabCase(project.name)}.png`
				}),
				ProjectController.#updateProject(projectId, updateOptions)
			]);
			if (projectUpdatePromisesResolvesArray[1].error) throw projectUpdatePromisesResolvesArray[1].error;
			else return projectUpdatePromisesResolvesArray[1].message;
		} else {
			const result = await ProjectController.#updateProject(projectId, updateOptions);
			if (result.error) throw result.error;
			else return result.message;
		}
	}
	/**
	 * 
	 * @param {string} projectId
	 * @throws Will throw an error if Project instance could not be deleted 
	 * @returns {Promise.<string>}
	 */
	static async deleteProject(projectId) {
		const project = await ProjectController.getProject({
			id: projectId
		});
		const projectDeletionPromisesResolvesArray = await Promise.all([
			s3Client.deleteFile({
				bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
				key: `projects/${kebabCase(project.name)}.png`
			}),
			ProjectController.#deleteProject(projectId)
		]);
		if (projectDeletionPromisesResolvesArray[1].error) throw projectDeletionPromisesResolvesArray[1].error;
		else return projectDeletionPromisesResolvesArray[1].message;
	}
	/**
	 * Fetches all Project instances from DB
	 * @returns {Promise.<Array.<Project>>}
	 */
	static async getAllProjects() {
		return await Project.findAll();
	}
	/**
	 * Fetches single Project instance from DB according to specified attributes
	 * @param {object} searchParameters - Project-related attributes used to search DB
	 * @returns {Promise.<Project>}
	 */
	static async getProject(searchParameters) {
		return await Project.findOne({
			where: searchParameters
		});
	}
	/**
	 * 
	 * @param {string} projectId 
	 * @returns {Promise.<Project>}
	 */
	static async getProjectById(projectId) {
		return await ProjectController.getProject({
			id: projectId
		});
	}
	/**
	 * Fetches single Project instance from DB by `Project.prototype.name` property
	 * @param {string} projectName 
	 * @returns {Promise.<Project>}
	 */
	static async getProjectByName(projectName) {
		return await ProjectController.getProject({
			name: projectName
		});
	}
	/**
	 * Fetches all Project instances from DB where `Project.prototype.featured` is `true`
	 * @returns {Promise.<Array.<Project>>}
	 */
	static async getFeaturedProjects() {
		return await Project.findAll({
			where: {
				featured: {
					[Op.or]: [true, 1]
				}
			},
			limit: 3
		});
	}
	static async verifyProject(projectId) {
		return (await ProjectController.getProject({ id: projectId })) instanceof Project ? true : false;
	}
};