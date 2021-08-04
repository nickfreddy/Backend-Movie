const app = require("../index");
const request = require("supertest");
const faker = require("faker");

const testEmail = faker.internet.email();

describe("/auth/register POST", () => {
  it("Invalid Email", async () => {
    const response = await request(app).post(`/auth/register`).send({
      username: "Test Tiss",
      email: "monkey wrench",
      password: "Str0ngp@ssword",
    });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Password Not Strong", async () => {
    const response = await request(app).post(`/auth/register`).send({
      username: "Test Tiss",
      email: faker.internet.email(),
      password: "weakpassword",
    });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Username Required", async () => {
    const response = await request(app).post(`/auth/register`).send({
      email: faker.internet.email(),
      password: "Str0ngp@ssword",
    });

    expect(response.statusCode).toEqual(401);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Email Required", async () => {
    const response = await request(app).post(`/auth/register`).send({
      username: "Test Tiss",
      password: "Str0ngp@ssword",
    });

    expect(response.statusCode).toEqual(500);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Password Required", async () => {
    const response = await request(app).post(`/auth/register`).send({
      username: "Test Tiss",
      email: faker.internet.email(),
    });

    expect(response.statusCode).toEqual(500);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Registered", async () => {
    const response = await request(app).post(`/auth/register`).send({
      username: "Test Tiss",
      email: testEmail,
      password: "Str0ngp@ssword",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Duplicate Email", async () => {
    const response = await request(app).post(`/auth/register`).send({
      username: "Test Tist",
      email: testEmail,
      password: "Str0ngp@ssword",
    });

    expect(response.statusCode).toEqual(401);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("/auth/login POST", () => {
  it("Wrong Email", async () => {
    const response = await request(app).post(`/auth/login`).send({
      email: "forgot@dummy.com",
      password: "Str0ngp@ssword",
    });

    expect(response.statusCode).toEqual(401);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Invalid Email", async () => {
    const response = await request(app).post(`/auth/login`).send({
      email: "forgot@dummy",
      password: "Str0ngp@ssword",
    });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Wrong password", async () => {
    const response = await request(app).post(`/auth/login`).send({
      email: testEmail,
      password: "Str0ngp@ssword123",
    });

    expect(response.statusCode).toEqual(401);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Email Required", async () => {
    const response = await request(app).post(`/auth/login`).send({
      password: "Str0ngp@ssword",
    });

    expect(response.statusCode).toEqual(500);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Password Required", async () => {
    const response = await request(app).post(`/auth/login`).send({
      email: testEmail,
    });

    expect(response.statusCode).toEqual(401);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Logged In", async () => {
    const response = await request(app).post(`/auth/login`).send({
      email: testEmail,
      password: "Str0ngp@ssword",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });
});
