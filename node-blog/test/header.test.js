const Page = require("./helpers/page");

let page;

beforeEach(async () => {
	page = await Page.build();
	await page.goto("localhost:3000");
});

afterEach(async () => {
	await page.close();
});

test("The header has the correct text", async (done) => {
	const text = await page.getContentsOf("a.brand-logo");

	expect(text).toEqual("Blogster");

	done();
});

test("Clicking login starts the o-auth flow", async (done) => {
	await page.click(".right a");

	const authUrl = await page.url();

	expect(authUrl).toMatch("accounts.google.com");

	done();
});

test("When signed in, shows a logout button", async (done) => {
	await page.login();
	const text = await page.getContentsOf('a[href="/auth/logout"]');

	expect(text).toEqual("Logout");

	done();
});
