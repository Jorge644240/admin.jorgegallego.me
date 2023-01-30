module.exports = class ResourceNotFoundError extends Error {
	/**
	 * @constructs ResourceNotFoundError
	 * @param {object} config - ResourceNotFoundError configuration options
	 * @param {string} config.resourceType - DB resource intended for search
	 * @param {object} config.searchParameters - Attributes used in unsuccessful search 
	 */
	constructor(config) {
		super("The specified resource doesn't exist");
		this.name = "ResourceNotFoundError";
		this.resourceType = config.resourceType;
		this.searchParameters = config.searchParameters || {};
	}
};