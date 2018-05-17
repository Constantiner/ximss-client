const startXimssSession = async ({
	userName,
	password,
	serverName,
	asyncMode = "syncPOST",
	loginMethod = "auto",
	version = "6.2",
	secureMode = true
}) => {
	return {
		userName,
		password,
		serverName,
		asyncMode,
		loginMethod,
		version,
		secureMode
	};
};

export { startXimssSession };
