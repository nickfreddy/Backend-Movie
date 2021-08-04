// Adib's Code
const request = require("supertest");
const faker = require("faker");
const jwt = require("jsonwebtoken");
const app = require("../index");
const { user } = require("../models");

let mainUserId = "";
let adminId = "";
let otherUserId = "";

let userToken = "";
let adminToken = "";
let otherUserToken = "";

const randomHexKey = "610495fa3f542a2a09759573";

beforeAll(async () => {
  //   data = await Promise.all([user.find()]);

  const mainUser = await user.create({
    username: "Main User",
    email: faker.internet.email(),
    password: "Aneh123!!",
  });

  const admin = await user.create({
    username: "Admin",
    email: faker.internet.email(),
    password: "Aneh123!!",
    role: "admin",
  });

  const otherUser = await user.create({
    username: "Other User",
    email: faker.internet.email(),
    password: "Aneh123!!",
  });

  mainUserId = mainUser._id.toString();
  adminId = admin._id.toString();
  otherUserId = otherUser._id.toString();

  userToken = jwt.sign({ user: mainUserId }, process.env.JWT_SECRET);
  adminToken = jwt.sign({ user: adminId }, process.env.JWT_SECRET);
  otherUserToken = jwt.sign({ user: otherUserId }, process.env.JWT_SECRET);
});

describe("/users GET", () => {
  it("User not found", async () => {
    const response = await request(app).get(`/users/${randomHexKey}`).send({});

    expect(response.statusCode).toEqual(500);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Invalid User ID", async () => {
    const response = await request(app).get("/users/helloworld").send({});

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Success, with Page and Limit Queries", async () => {
    const response = await request(app)
      .get(`/users/${mainUserId}`)
      .query({ page: 1, limit: 1 })
      .send({});

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Success, No Queries", async () => {
    const response = await request(app).get(`/users/${mainUserId}`).send({});

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("/users PUT", () => {
  it("User Not Found", async () => {
    const response = await request(app)
      .put(`/users/helloworld`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        username: "Testname",
        email: "test@dummy.com",
        description: "This is a test.",
        photo: "www.testphoto.com",
      });

    expect(response.statusCode).toEqual(500);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Missing Token", async () => {
    const response = await request(app)
      .put(`/users/${mainUserId}`)
      .set("Authorization", `Bearer HELLO`)
      .send({
        username: "Testname",
        email: "test@dummy.com",
        description: "This is a test.",
        photo: "www.testphoto.com",
      });

    expect(response.statusCode).toEqual(403);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Missing Authorization Header", async () => {
    const response = await request(app).put(`/users/${mainUserId}`).send({
      username: "Testname",
      email: "test@dummy.com",
      description: "This is a test.",
      photo: "www.testphoto.com",
    });

    expect(response.statusCode).toEqual(403);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Other User Cannot Update", async () => {
    const response = await request(app)
      .put(`/users/${mainUserId}`)
      .set("Authorization", `Bearer ${otherUserToken}`)
      .send({
        username: "Testname",
        email: "test@dummy.com",
        description: "This is a test.",
        photo: "www.testphoto.com",
      });

    expect(response.statusCode).toEqual(403);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Invalid Email", async () => {
    const response = await request(app)
      .put(`/users/${mainUserId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        username: "Testname",
        email: "monkey wrench",
        description: "This is a test.",
        photo: "www.testphoto.com",
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("User is Updated by Admin", async () => {
    const response = await request(app)
      .put(`/users/${otherUserId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        username: "Testname",
        email: faker.internet.email(),
        description: "This is a test.",
        photo: "www.testphoto.com",
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("User is Updated", async () => {
    const response = await request(app)
      .put(`/users/${mainUserId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        username: "Testname",
        email: faker.internet.email(),
        description: "This is a test.",
        photo: "www.testphoto.com",
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("/users DEL", () => {
  it("User Not Found", async () => {
    const response = await request(app)
      .delete(`/users/helloworld`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        username: "Testname",
        email: "test@dummy.com",
        description: "This is a test.",
        photo: "www.testphoto.com",
      });

    expect(response.statusCode).toEqual(500);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Missing Token", async () => {
    const response = await request(app)
      .delete(`/users/${mainUserId}`)
      .set("Authorization", `Bearer HELLO`);

    expect(response.statusCode).toEqual(403);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Missing Authorization Header", async () => {
    const response = await request(app).delete(`/users/${mainUserId}`);

    expect(response.statusCode).toEqual(403);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Other User Cannot Delete", async () => {
    const response = await request(app)
      .delete(`/users/${mainUserId}`)
      .set("Authorization", `Bearer ${otherUserToken}`);

    expect(response.statusCode).toEqual(403);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Success, Deleted by User/ Admin", async () => {
    const response = await request(app)
      .delete(`/users/${mainUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });
});
