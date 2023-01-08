module.exports = class ResourceNotFoundError extends Error {
	constructor(config) {
		super("The specified resource doesn't exist");
		this.name = "ResourceNotFoundError";
		this.resourceType = config.resourceType;
		this.searchParameters = config.searchParameters || {};
	}
};