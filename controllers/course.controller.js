const ResourceNotFoundError = require("../data/errors/ResourceNotFoundError");
const Course = require("../models/course.model");

/**
 * @typedef {Object} DBActionResponse
 * @property {string} message - DB action status
 * @property {Course|void} [course]
 * @property {Error} [error]
 */

module.exports = class CourseController {
	/**
	 * Creates new Course instance in DB
	 * @param {object} courseData 
	 * @param {string} courseData.name
	 * @param {string} courseData.school
	 * @param {string} courseData.url
	 * @param {number} courseData.year
	 * @param {string} courseData.topic
	 * @returns {Promise.<DBActionResponse>}
	 */
	static async #createCourse(courseData) {
		const course = new Course(courseData);
		try {
			const result = await course.save();
			return {
				message: "Course created successfully",
				course: result
			};
		} catch (err) {
			return {
				message: "Failed to create Course",
				error: err.original || err
			};
		};
	}
	/**
	 * Deletes specified Course instance from DB
	 * @param {number} courseId 
	 * @returns {Promise.<DBActionResponse>}
	 */
	static async #deleteCourse(courseId) {
		const course = await Course.findOne({
			where: {
				id: courseId
			}
		});
		try {
			if (course === null) throw new ResourceNotFoundError({
				resourceType: "Course",
				searchParameters: {
					id: courseId
				}
			});
			const result = await course.destroy();
			return {
				message: "Course deleted successfully",
				course: result
			};
		} catch (err) {
			return {
				message: "Failed to delete Course",
				error: err.original || err
			};
		};
	}
	/**
	 * Create Course instance in DB
	 * @param {object} courseData 
	 * @param {string} courseData.name
	 * @param {string} courseData.school
	 * @param {string} courseData.url
	 * @param {number} courseData.year
	 * @param {string} courseData.topic
	 * @throws Will throw an error if Course instance could not be created in DB
	 * @returns {Promise.<string>}
	 */
	static async createCourse(courseData) {
		const result = await CourseController.#createCourse(courseData);
		if (result.error) throw result.error;
		else return result.message;
	}
	/**
	 * Delete Course instance from DB
	 * @param {string} courseId 
	 * @throws Will throw an error if Course instance could not be deleted from DB
	 * @returns {Promise.<string>}
	 */
	static async deleteCourse(courseId) {
		const result = await CourseController.#deleteCourse(courseId);
		if (result.error) throw result.error;
		else return result.message;
	}
	/**
	 * Returns all Course instances in DB
	 * @returns {Promise.<Array.<Course>>}
	 */
	static async getAllCourses() {
		return await Course.findAll({
			order: [
				["year", "DESC"]
			]
		});
	}
	/**
	 * Return single Course instance from DB that matches `searchParameters` argument
	 * @param {object} searchParameters - Course prototype attributes to search DB for
	 * @returns {Promise.<Course>}
	 */
	static async getCourse(searchParameters) {
		return await Course.findOne({
			where: searchParameters
		});
	}
	/**
	 * Returns Course instance from DB that matches `id` attribute to `courseId` argument
	 * @param {number} courseId 
	 * @returns {Promise.<Course>}
	 */
	static async getCourseById(courseId) {
		return await CourseController.getCourse({
			id: courseId
		});
	}
	/**
	 * Return single Course instance from DB that matches `name` attribute to `courseName` argument
	 * @param {string} courseName - Name of course to search for
	 * @returns {Promise.<Course>}
	 */
	static async getCourseByName(courseName) {
		return await CourseController.getCourse({
			name: courseName
		});
	}
	/**
	 * Return array of Course instances ordered by `year` attribute in descending order
	 * @returns {Promise.<Array.<Course>>}
	 */
	static async getLatestCourses() {
		return await Course.findAll({
			order: [
				["year", "DESC"]
			],
			limit: 7
		});
	}
	/**
	 * Returns `true` if Course exists in DB, `false` otherwise
	 * @param {number} courseId 
	 * @returns {Promise.<boolean>}
	 */
	static async verifyCourse(courseId) {
		return (await CourseController.getCourseById(courseId)) instanceof Course ? true : false;
	}
};