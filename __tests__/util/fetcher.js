import { fetcher } from "../../src/util/fetcher";

describe("Fetcher reference implementation tests", () => {
	beforeEach(() => fetch.resetMocks());
	it("should make basic request", async () => {
		const expectedResponseText = "Test";
		const url = "example.com";
		const method = "POST";
		const body = "Test body";

		fetch.mockResponseOnce(expectedResponseText, { status: 200, ok: true });

		const realResponseText = await fetcher()(method)(url)(body);
		expect(realResponseText).toBe(expectedResponseText);
		expect(fetch.mock.calls.length).toBe(1);
		const request = fetch.mock.calls[0][0];
		expect(request.url).toBe(url);
		expect(request.method).toBe(method);
		expect(request.body).toBe(body);
		const headers = request.headers;
		expect(headers.get("Content-Type")).toBe("text/xml; charset=utf-8");
	});

	it("should make request with additional parameters", async () => {
		const expectedResponseText = "Test";
		const url = "example.com";
		const method = "POST";
		const body = "Test body";
		const redirect = "manual";
		const additionalHeaderName = "Accept-Encoding";
		const additionalHeaderValue = "gzip, deflate";

		fetch.mockResponseOnce(expectedResponseText, { status: 200, ok: true });

		const realResponseText = await fetcher({ redirect }, { [additionalHeaderName]: additionalHeaderValue })(method)(
			url
		)(body);
		expect(realResponseText).toBe(expectedResponseText);
		expect(fetch.mock.calls.length).toBe(1);
		const request = fetch.mock.calls[0][0];
		expect(request.url).toBe(url);
		expect(request.method).toBe(method);
		expect(request.body).toBe(body);
		const headers = request.headers;
		expect(headers.get("Content-Type")).toBe("text/xml; charset=utf-8");
		expect(headers.get(additionalHeaderName)).toBe(additionalHeaderValue);
		expect(request.redirect).toBe(redirect);
	});

	it("should make request without body", async () => {
		const expectedResponseText = "Test";
		const url = "example.com";
		const method = "POST";

		fetch.mockResponseOnce(expectedResponseText, { status: 200, ok: true });

		const realResponseText = await fetcher()(method)(url)();
		expect(realResponseText).toBe(expectedResponseText);
		expect(fetch.mock.calls.length).toBe(1);
		const request = fetch.mock.calls[0][0];
		expect(request.url).toBe(url);
		expect(request.method).toBe(method);
		expect(request.body).toBeUndefined();
		const headers = request.headers;
		expect(headers.get("Content-Type")).toBe("text/xml; charset=utf-8");
	});

	it("should make request with empty body", async () => {
		const expectedResponseText = "Test";
		const url = "example.com";
		const method = "POST";

		fetch.mockResponseOnce(expectedResponseText, { status: 200, ok: true });

		const realResponseText = await fetcher()(method)(url)("");
		expect(realResponseText).toBe(expectedResponseText);
		expect(fetch.mock.calls.length).toBe(1);
		const request = fetch.mock.calls[0][0];
		expect(request.url).toBe(url);
		expect(request.method).toBe(method);
		expect(request.body).toBeUndefined();
		const headers = request.headers;
		expect(headers.get("Content-Type")).toBe("text/xml; charset=utf-8");
	});

	it("should return server's status text for bad requests", async () => {
		const url = "example.com";
		const method = "POST";
		const body = "Test body";
		const statusText = "Test status text";

		fetch.mockResponseOnce("Test", { status: 404, ok: false, statusText });
		try {
			await fetcher()(method)(url)(body);
		} catch (error) {
			expect(error.message).toBe(statusText);
			expect(fetch.mock.calls.length).toBe(1);
			const request = fetch.mock.calls[0][0];
			expect(request.url).toBe(url);
			expect(request.method).toBe(method);
			expect(request.body).toBe(body);
			const headers = request.headers;
			expect(headers.get("Content-Type")).toBe("text/xml; charset=utf-8");
		}
	});

	it('should return "you have been disconnected" status text for bad requests without server\'s status text and status code 550', async () => {
		const url = "example.com";
		const method = "POST";
		const body = "Test body";

		fetch.mockResponseOnce("Test", { status: 550, ok: false });
		try {
			await fetcher()(method)(url)(body);
		} catch (error) {
			expect(error.message).toBe("you have been disconnected");
			expect(fetch.mock.calls.length).toBe(1);
			const request = fetch.mock.calls[0][0];
			expect(request.url).toBe(url);
			expect(request.method).toBe(method);
			expect(request.body).toBe(body);
			const headers = request.headers;
			expect(headers.get("Content-Type")).toBe("text/xml; charset=utf-8");
		}
	});

	it('should return "server protocol error" status text for bad requests without server\'s status text and unknown status code', async () => {
		const url = "example.com";
		const method = "POST";
		const body = "Test body";

		fetch.mockResponseOnce("Test", { status: 551, ok: false });
		try {
			await fetcher()(method)(url)(body);
		} catch (error) {
			expect(error.message).toBe("server protocol error");
			expect(fetch.mock.calls.length).toBe(1);
			const request = fetch.mock.calls[0][0];
			expect(request.url).toBe(url);
			expect(request.method).toBe(method);
			expect(request.body).toBe(body);
			const headers = request.headers;
			expect(headers.get("Content-Type")).toBe("text/xml; charset=utf-8");
		}
	});

	it('should return "server response is not XML" status text for successful requests with empty response body', async () => {
		const url = "example.com";
		const method = "POST";
		const body = "Test body";

		fetch.mockResponseOnce("", { status: 200, ok: true });
		try {
			await fetcher()(method)(url)(body);
		} catch (error) {
			expect(error.message).toBe("server response is not XML");
			expect(fetch.mock.calls.length).toBe(1);
			const request = fetch.mock.calls[0][0];
			expect(request.url).toBe(url);
			expect(request.method).toBe(method);
			expect(request.body).toBe(body);
			const headers = request.headers;
			expect(headers.get("Content-Type")).toBe("text/xml; charset=utf-8");
		}
	});
});
