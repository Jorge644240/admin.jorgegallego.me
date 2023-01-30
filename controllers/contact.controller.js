const Contact = require("../models/contact.model")

module.exports = class ContactController {
	static async getAllContacts() {
		return await Contact.findAll();
	}
	static async filterContacts(filterParameters) {
		return await Contact.findAll({
			where: filterParameters
		});
	}
	static async getLatestContacts() {
		return (await Contact.findAll()).reverse().slice(0, 5);
	}
	static async getContact(searchParameters) {
		return await Contact.findOne({
			where: searchParameters
		});
	}
	static async getContactByEmail(contactEmail) {
		return await ContactController.getContact({ email:contactEmail });
	}
	static async getContactsByService(contactService) {
		return await ContactController.filterContacts({ service:contactService });
	}
};