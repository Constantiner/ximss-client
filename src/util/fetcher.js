const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
const formRequestParams = (method, contentType, body, requestParams, requestHeaders) => {
	const effectiveHeaders = new Headers(
		Object.assign(
			{
				"Content-Type": contentType
			},
			requestHeaders
		)
	);
	let effectiveRequestParams = {
		method,
		headers: effectiveHeaders
	};
	if (body !== null && body !== undefined) {
		effectiveRequestParams.body = body;
	}
	return Object.assign(effectiveRequestParams, requestParams);
};
const formRequest = url => requestParams => new Request(url, requestParams);
const statusTextMatches = [
	{
		predicate: x => x === 0,
		statusText: "server communication error"
	},
	{
		predicate: x => x === 550,
		statusText: "you have been disconnected"
	},
	{
		predicate: () => true,
		statusText: "server protocol error"
	}
];
const produceCustomStatusText = response =>
	statusTextMatches.find(match => match.predicate(response.status)).statusText;
const getBadResponseStatusText = response => response.statusText || produceCustomStatusText(response);
const handleBadResponse = response => new Error(getBadResponseStatusText(response));
const fetcher = (requestParams = {}, requestHeaders = {}) => (
	method,
	contentType = "text/xml; charset=utf-8"
) => url => async body => {
	const response = await fetch(
		compose(formRequest(url), formRequestParams)(method, contentType, body, requestParams, requestHeaders)
	);
	if (!response.ok) {
		throw handleBadResponse(response);
	}
	const responseText = await response.text();
	if (!responseText) {
		throw new Error("server response is not XML");
	}
	return responseText;
};

export { fetcher };
