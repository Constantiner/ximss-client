import { startXimssSession } from "../src/ximss-client";

describe("Starting a new session", () => {
	it("should return a Promise", async () => {
		const userName = "constantiner",
			password = "test",
			serverName = "example.com",
			asyncMode = "syncPOST",
			loginMethod = "auto",
			version = "6.2",
			secureMode = true,
			loginData = {
				userName,
				password,
				serverName,
				asyncMode,
				loginMethod,
				version,
				secureMode
			};
		expect.assertions(1);
		const data = await startXimssSession(loginData);
		expect(data).toEqual(loginData);
	});
});
