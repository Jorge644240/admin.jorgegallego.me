const { Op } = require("sequelize");
const Skill = require("../models/skill.model");
const ResourceNotFoundError = require("../data/errors/ResourceNotFoundError");

/**
 * @typedef {Object} DBActionResponse
 * @property {string} message - DB action status
 * @property {Project|void} [project]
 * @property {Error} [error]
 */

module.exports = class SkillController {
	static async #createSkill(skillData) {
		const skill = new Skill(skillData);
		try {
			const result = await skill.save();
			return {
				message: "Skill created successfully",
				skill: result
			};
		} catch (err) {
			return {
				message: "Failed to create Skill",
				error: err.original || err
			}
		}
	}
	static async #updateSkill(skillId, updateOptions) {
		const skill = await Skill.findOne({
			where: {
				id: skillId
			}
		});
		try {
			if (skill === null) throw new ResourceNotFoundError({
				resourceType: "Skill",
				searchParameters: {
					id: skillId
				}
			});
			for (const key in updateOptions) skill.setDataValue(key, updateOptions[key]);
			const result = await skill.save();
			return {
				message: "Skill updated successfully",
				skill: result
			};
		} catch (err) {
			return {
				message: "Failed to update Skill",
				error: err.orignal || err
			};
		};
	}
	static async #deleteSkill(skillId) {
		const skill = await Skill.findOne({
			where: {
				id: skillId
			}
		});
		try {
			if (skill === null) throw new ResourceNotFoundError({
				resourceType: "Skill",
				searchParameters: {
					id: skillId
				}
			});
			const result = await skill.destroy();
			return {
				message: "Skill deleted successfully",
				skill: result
			};
		} catch (err) {
			return {
				message: "Failed to delete Skill",
				error: err.orignal || err
			};
		}
	}
	static async createSkill(skillData) {
		const result = await SkillController.#createSkill(skillData);
		if (result.error) throw result.error;
		else return result.message;
	}
	static async updateSkill(skillId, updateOptions) {
		const result = await SkillController.#updateSkill(skillId, updateOptions);
		if (result.error) throw result.error;
		else return result.message;
	}
	static async deleteSkill(skillId) {
		const result = await SkillController.#deleteSkill(skillId);
		if (result.error) throw result.error;
		else return result.message;
	}
	static async getAllSkills() {
		return await Skill.findAll({
			order: [
				["level", "DESC"],
				["name", "ASC"]
			]
		});
	}
	static async getTopSkills() {
		return await Skill.findAll({
			where: {
				level: {
					[Op.or]: [3, 4]
				}
			},
			order: [
				["level", "DESC"]
			],
			limit: 5
		})
	}
	static async getSkillsByLevel(skillLevel) {
		return await Skill.findAll({
			where: {
				level: skillLevel
			}
		});
	}
	static async getSkillById(skillId) {
		return await Skill.findOne({
			where: {
				id: skillId
			}
		});
	}
	static async verifySkill(skillId) {
		return (await SkillController.getSkillById(skillId)) instanceof Skill ? true : false;
	}
};