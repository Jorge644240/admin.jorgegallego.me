jest.setTimeout(10000);

test("RDS MySQL Connection is made successfully", async () => {
	const connection = require("../../../data/aws/dbConnection");
	await connection.authenticate();
});