const request = require("supertest");
const app = require("../app");
// const db = require("../server.js");

describe("Login Controller", () => {
  beforeAll(async () => {
    // await db.setup();
  });

  afterAll(async () => {
    // await db.cleanup();
  });

  it("should return a 200 status code, token, and user object", async () => {
    const userCredentials = {
      email: "semen@cat.com",
      password: "Semen1234",
    };

    const response = await request(app).post("/login").send(userCredentials);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user).toHaveProperty("email");
    expect(response.body.user).toHaveProperty("subscription");
    expect(typeof response.body.user.email).toBe("string");
    expect(typeof response.body.user.subscription).toBe("string");
  });
});
