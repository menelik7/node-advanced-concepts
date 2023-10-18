const Page = require("./helpers/page");

let page;

beforeEach(async () => {
	page = await Page.build();
	await page.goto("localhost:3000");
});

afterEach(async () => {
	await page.close();
});

describe("When logged in", () => {
	beforeEach(async () => {
		await page.login();
		await page.click("a.btn-floating");
	});

	test("Can see blog create form", async (done) => {
		const label = await page.getContentsOf("form label");

		expect(label).toEqual("Blog Title");

		done();
	});

	describe("and using valid inputs", () => {
		beforeEach(async () => {
			await page.type(".title input", "My Title");
			await page.type(".content input", "My Content");
			await page.click("form button");
		});

		test("submitting takes user to review screen", async (done) => {
			const text = await page.getContentsOf("h5");

			expect(text).toEqual("Please confirm your entries");

			done();
		});

		test("submitting then saving adds blog to index page", async (done) => {
			await page.click("button.green");
			await page.waitFor(".card");
			const cardTitle = await page.getContentsOf(".card-title");
			const cardContent = await page.getContentsOf(".card-content p");

			expect(cardTitle).toEqual("My Title");
			expect(cardContent).toEqual("My Content");

			done();
		});
	});

	describe("and using invalid inputs", () => {
		beforeEach(async () => {
			await page.click("form button");
		});

		test("the form shows an error message", async (done) => {
			const titleError = await page.getContentsOf(".title .red-text");
			const contentError = await page.getContentsOf(".content .red-text");
			expect(titleError).toEqual("You must provide a value");
			expect(contentError).toEqual("You must provide a value");

			done();
		});
	});
});

describe("When user is not logged in", () => {
	const actions = [
		{
			method: "get",
			path: "/api/blogs",
		},
		{
			method: "post",
			path: "/api/blogs",
			data: {
				title: "My Title",
				content: "My Content",
			},
		},
	];

	test("blog related options are prohibited", async (done) => {
		const results = await page.execRequests(actions);

		for (let result of results) {
			expect(result).toEqual({ error: "You must log in!" });
		}

		done();
	});
});
