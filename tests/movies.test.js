const request = require("supertest");
const faker = require("faker");
const jwt = require("jsonwebtoken");
const app = require("../index");
const { movie } = require("../models");
// let data = [];
// let userToken = "";
// let adminToken = "";

// beforeAll(async () => {
//   data = await Promise.all([movie.find()]);

//   const user = await user.create({
//     username: faker.name.findName(),
//     email: faker.internet.email(),
//     password: "Aneh123!!",
//   });

//   const admin = await user.create({
//     username: faker.name.findName(),
//     email: faker.internet.email(),
//     password: "Aneh123!!",
//     role: "admin",
//   });

//   userToken = jwt.sign({ user: user._id }, process.env.JWT_SECRET);
//   adminToken = jwt.sign({ user: admin._id }, process.env.JWT_SECRET);
// });

describe("/Movie GET All", () => {
  it("Movie must exist", async () => {
    const response = await request(app)
      .get("/movies")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(res.body.message).toEqual("Successfully Get All Data Movie");
  });

  it("Get all movies by page", async () => {
    const response = await request(app)
      .get("/movies?page=2")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(res.body.message).toEqual("Successfully Get Movie by Page");
  });

  it("Get all movies by limit", async () => {
    const response = await request(app)
      .get("/movies?limit=1")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(res.body.message).toEqual("Successfully Get Movie by Limit");
  });

  it("Get all movies by page and limit ", async () => {
    const response = await request(app)
      .get("/movies?page=2&limit=2")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(res.body.message).toEqual(
      "Successfully Get Movie by Page and Limit"
    );
  });

  it("Invalid Page Query", async () => {
    const response = await request(app)
      .get("/movies?page=1test&limit=5")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(res.body.message).toEqual("Page request must be number");
  });

  it("Invalid Limit Query", async () => {
    const response = await request(app)
      .get("/movies?page=1&limit=5test")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(res.body.message).toEqual("Limit request must be number");
  });

  it("Invalid Page and Limit Query", async () => {
    const response = await request(app)
      .get("/movies?page=1test&limit=5test")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(res.body.message).toEqual("Page and Limit request must be number");
  });

  it("Wrong Route", async () => {
    const response = await request(app)
      .get("/movie?page=2&limit=1")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(res.body.message).toEqual("Endpoint not found");
  });

  it("Movie Not Found", async () => {
    const response = await request(app)
      .get("/movies?page=10&limit=5")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(res.body.message).toEqual("Movie not Found");
  });

  it("Movie Page must be Non-Negative", async () => {
    const response = await request(app)
      .get("/movies?page=0&limit=1")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(500);
    expect(response.body).toBeInstanceOf(Object);
    expect(res.body.message).toEqual("Page Must be Non-Negative");
  });
});

describe("/Search Movie", () => {
  it("Search by Title, Page, and Limit", async () => {
    const response = await request(app)
      .get("/movies/search?title=the&page=1&limit=2")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Search by Page", async () => {
    const response = await request(app)
      .get("/movies/search?page=1")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Search by Limit", async () => {
    const response = await request(app)
      .get("/movies/search?limit=3")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Search by Title", async () => {
    const response = await request(app)
      .get("/movies/search?title=wi")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Search by Title and Page", async () => {
    const response = await request(app)
      .get("/movies/search?title=the&page=1")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Search by Title and Limit", async () => {
    const response = await request(app)
      .get("/movies/search?title=the&limit=3")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Search by Page and Limit", async () => {
    const response = await request(app)
      .get("/movies/search?page=1&limit=2")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie not Found by Title", async () => {
    const response = await request(app)
      .get("/movies/search?title=Dora")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie not Found by Page", async () => {
    const response = await request(app)
      .get("/movies/search?page=50")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Wrong Route", async () => {
    const response = await request(app)
      .get("/movie/search")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie Page Must Number", async () => {
    const response = await request(app)
      .get("/movies/search?page=tes&limit=11&title=Dora")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie Limit must Number", async () => {
    const response = await request(app)
      .get("/movies/search?page=1&limit=tes&title=Dora")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie Page and Limit must Number", async () => {
    const response = await request(app)
      .get("/movies/search?page=tes&limit=tes&title=Dora")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(500);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie Page Must be Non-Negative", async () => {
    const response = await request(app)
      .get("/movies/search?page=0")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(500);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("/Select Movie by Genre", () => {
  it("Get Movie's Genre", async () => {
    const response = await request(app)
      .get("/movies/genres/romance")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get Movie's Genre by Page", async () => {
    const response = await request(app)
      .get("/movies/genres/romance?page=1")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get Movie's Genre by Limit", async () => {
    const response = await request(app)
      .get("/movies/genres/romance?limit=2")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get Movie's Genre by Page and Limit", async () => {
    const response = await request(app)
      .get("/movies/genres/romance?page=2&limit=2")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie not Found", async () => {
    const response = await request(app)
      .get("/movies/genres/adventure")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie not Found by Page", async () => {
    const response = await request(app)
      .get("/movies/genres/action?page=20")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Wrong Route", async () => {
    const response = await request(app)
      .get("/movie/genres/action?page=1&limit=1")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie Page must Number", async () => {
    const response = await request(app)
      .get("/movies/genres/action?page=tes&limit=2")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie Limit must Number", async () => {
    const response = await request(app)
      .get("/movies/genres/action?page=1&limit=tes")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie Page and Limit Must Number", async () => {
    const response = await request(app)
      .get("/movies/genres/action?page=tes&limit=tes")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("/Movie Detail", () => {
  it("Get Detail Movie", async () => {
    const response = await request(app)
      .get("/movies/6106ba988278ce1864d5c19c")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get Movie by Review Limit", async () => {
    const response = await request(app)
      .get("/movies/6106ba988278ce1864d5c19c?revlimit=1")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get Movie by Review Limit and Review Page", async () => {
    const response = await request(app)
      .get("/movies/6106ba988278ce1864d5c19c?revlimit=1&revpage=1")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Invalid Movie's Id", async () => {
    const response = await request(app)
      .get("/movies/6106ba988278ce1864d5c19cA?revlimit=1&revpage=1")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Wrong Route", async () => {
    const response = await request(app)
      .get("/movie/6106ba988278ce1864d5c19c?revlimit=1&revpage=1")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie's Review Limit must Number", async () => {
    const response = await request(app)
      .get("/movies/6106ba258278ce1864d5c199?revlimit=tes")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie's Page must Number", async () => {
    const response = await request(app)
      .get("/movies/6106ba258278ce1864d5c199?revpage=tes")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie's Review Page and Limit Must Number", async () => {
    const response = await request(app)
      .get("/movies/6106ba258278ce1864d5c199?revlimit=tes&revpage=tes")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });
});
