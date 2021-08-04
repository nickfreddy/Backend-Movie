// Amri's Code
const request = require("supertest");
const faker = require("faker");
const jwt = require("jsonwebtoken");
const app = require("../index");
const { movie, user } = require("../models");
let data = [];
let userToken = "";
let adminToken = "";

beforeAll(async () => {
  data = await Promise.all([movie.find(), customer.find()]);

  const employee = await user.create({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: "Aneh123!!",
  });

  const admin = await user.create({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: "Aneh123!!",
    role: "admin",
  });

  userToken = jwt.sign({ user: employee._id }, process.env.JWT_SECRET);
  adminToken = jwt.sign({ user: admin._id }, process.env.JWT_SECRET);
});

describe("/transactions POST", () => {
  it("Transactions must be created", async () => {
    const response = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        id_good: data[0][Math.floor(Math.random() * data[0].length)]._id,
        id_customer: data[1][Math.floor(Math.random() * data[1].length)]._id,
        quantity: "10",
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("id_good is not valid", async () => {
    const response = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        id_good: "asdsadasdsadsa",
        id_customer: data[1][Math.floor(Math.random() * data[1].length)]._id,
        quantity: "10",
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("id_customer is not valid", async () => {
    const response = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        id_good: data[0][Math.floor(Math.random() * data[0].length)]._id,
        id_customer: "asdsadasdsadsa",
        quantity: "10",
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("id_good and id_customer is not valid", async () => {
    const response = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        id_good: "asdsadasdsadsa",
        id_customer: "asdsadasdsadsa",
        quantity: "10",
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Forbidden access for user", async () => {
    const response = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        id_good: data[0][Math.floor(Math.random() * data[0].length)]._id,
        id_customer: data[1][Math.floor(Math.random() * data[1].length)]._id,
        quantity: "10",
      });

    expect(response.statusCode).toEqual(403);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("/transactions GET", () => {
  it("Transactions must extst", async () => {
    const response = await request(app)
      .get("/transactions")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });
});
