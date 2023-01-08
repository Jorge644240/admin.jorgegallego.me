test("Environment variables loaded with `require('dotenv').config()`", () => {
	require("dotenv").config();
	expect(process.env).toHaveProperty("COOKIE_SIGNATURE");
	expect(process.env).toHaveProperty("JWT_SIGNATURE");
	expect(process.env).toHaveProperty("RDS_DB_HOST");
	expect(process.env).toHaveProperty("RDS_DB_USERNAME");
	expect(process.env).toHaveProperty("RDS_DB_PASSWORD");
	expect(process.env).toHaveProperty("RDS_DB_NAME");
	expect(process.env).toHaveProperty("STRICT_TRANSPORT_SECURITY");
	expect(process.env).toHaveProperty("X_CONTENT_TYPE_OPTIONS");
	expect(process.env).toHaveProperty("X_XSS_PROTECTION");
	expect(process.env).toHaveProperty("X_FRAME_OPTIONS");
	expect(process.env).toHaveProperty("CONTENT_SECURITY_POLICY");
});