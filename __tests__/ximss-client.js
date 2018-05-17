import { startXimssSession } from "../src/ximss-client";

describe("Starting a new session", () => {
	it("should return a Promise", () => {
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
		return startXimssSession(loginData).then(data => expect(data).toEqual(loginData));
	});
});
