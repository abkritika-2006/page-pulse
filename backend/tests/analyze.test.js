const request = require("supertest");
const app = require("../app");

describe("POST /analyze", () => {

    test("should return 400 when URL is missing", async () => {

        const response = await request(app)
            .post("/analyze")
            .send({});

        expect(response.statusCode).toBe(400);

        expect(response.body.error).toBeDefined();

    });

    test("should return error for invalid URL", async () => {

        const response = await request(app)
            .post("/analyze")
            .send({
                url: "abc"
            });

        expect(response.statusCode).toBeGreaterThanOrEqual(400);

    });

    test("should analyze a valid website", async () => {

        const response = await request(app)
            .post("/analyze")
            .send({
                url: "https://example.com"
            });

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty("httpStatus");
        expect(response.body).toHaveProperty("pageTitle");
        expect(response.body).toHaveProperty("responseTime");
        expect(response.body).toHaveProperty("metaDescription");
        expect(response.body).toHaveProperty("h1Count");
        expect(response.body).toHaveProperty("imagesMissingAlt");
        expect(response.body).toHaveProperty("approximateWordCount");

    });

});