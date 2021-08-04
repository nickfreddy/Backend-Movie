const request = require("supertest");
const faker = require("faker");
const jwt = require("jsonwebtoken");
const app = require("../index");
const { user, movie } = require("../models");

let mainUserId = "";
let adminId = "";

let userToken = "";
let adminToken = "";

let movieId = "";

let title = "";
let page = "1";
let limit = "1";
let revPage = "2";
let revLimit = "2";

const randomPage = "50";
const randomHexKey = "610495fa3f542a2a09759573";

beforeAll(async () => {
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

  const movieTest = await movie.create({
    title: "Movie Test",
    genres: "action",
    release_year: "2021",
    poster: "www.testposter.com",
    trailer: "www.testtrailer.com",
    synopsis: "Lorem ipsum",
  });

  movieId = movieTest._id.toString();
  mainUserId = mainUser._id.toString();
  adminId = admin._id.toString();

  userToken = jwt.sign({ user: mainUserId }, process.env.JWT_SECRET);
  adminToken = jwt.sign({ user: adminId }, process.env.JWT_SECRET);
});

describe("/Movie GET All", () => {
  it("Movie must exist", async () => {
    const response = await request(app).get("/movies");

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get all movies by page", async () => {
    const response = await request(app).get(`/movies?page=${page}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get all movies by limit", async () => {
    const response = await request(app).get(`/movies?limit=${limit}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get all movies by page and limit ", async () => {
    const response = await request(app).get(
      `/movies?page=${page}&limit=${limit}`
    );

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Invalid Page Query", async () => {
    const response = await request(app).get(
      `/movies?page=1test&limit=${limit}`
    );

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Invalid Limit Query", async () => {
    const response = await request(app).get(`/movies?page=${page}&limit=5test`);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Invalid Page and Limit Query", async () => {
    const response = await request(app).get("/movies?page=1test&limit=5test");

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Wrong Route", async () => {
    const response = await request(app).get(
      `/movie?page=${page}&limit=${limit}`
    );
    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie Not Found", async () => {
    const response = await request(app).get(
      `/movies?page=${randomPage}&limit=${limit}`
    );

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie Page must be Non-Negative", async () => {
    const response = await request(app).get(`/movies?page=0&limit=${limit}`);

    expect(response.statusCode).toEqual(500);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("/Search Movie", () => {
  it("Search by Title, Page, and Limit", async () => {
    const response = await request(app).get(
      `/movies/search?title=${title}&page=${page}&limit=${limit}`
    );

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Search by Page", async () => {
    const response = await request(app).get(`/movies/search?page=${page}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Search by Limit", async () => {
    const response = await request(app).get(`/movies/search?limit=${limit}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Search by Title", async () => {
    const response = await request(app).get(`/movies/search?title=${title}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Search by Title and Page", async () => {
    const response = await request(app).get(
      `/movies/search?title=${title}&page=${page}`
    );

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Search by Title and Limit", async () => {
    const response = await request(app).get(
      `/movies/search?title=${title}&limit=${limit}`
    );

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Search by Page and Limit", async () => {
    const response = await request(app).get(
      `/movies/search?page=${page}&limit=${limit}`
    );

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie not Found by Title", async () => {
    const response = await request(app).get("/movies/search?title=Dora");

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie not Found by Page", async () => {
    const response = await request(app).get(
      `/movies/search?page=${randomPage}`
    );

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Wrong Route", async () => {
    const response = await request(app).get("/movie/search");

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie Page Must Number", async () => {
    const response = await request(app).get(
      `/movies/search?page=tes&limit=${limit}&title=Dora`
    );

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie Limit must Number", async () => {
    const response = await request(app).get(
      `/movies/search?page=${page}&limit=tes&title=Dora`
    );

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie Page and Limit must Number", async () => {
    const response = await request(app).get(
      "/movies/search?page=tes&limit=tes&title=Dora"
    );

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie Page Must be Non-Negative", async () => {
    const response = await request(app).get("/movies/search?page=0");

    expect(response.statusCode).toEqual(500);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("/Select Movie by Genre", () => {
  it("Get Movie's Genre", async () => {
    const response = await request(app).get("/movies/genres/romance");

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get Movie's Genre by Page", async () => {
    const response = await request(app).get(
      `/movies/genres/romance?page=${page}`
    );

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get Movie's Genre by Limit", async () => {
    const response = await request(app).get(
      `/movies/genres/romance?limit=${limit}`
    );

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get Movie's Genre by Page and Limit", async () => {
    const response = await request(app).get(
      `/movies/genres/romance?page=${page}&limit=${limit}`
    );

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie not Found", async () => {
    const response = await request(app).get("/movies/genres/adventure");

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie not Found by Page", async () => {
    const response = await request(app).get(
      `/movies/genres/action?page=${randomPage}`
    );

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Wrong Route", async () => {
    const response = await request(app).get(
      `/movie/genres/action?page=${page}&limit=${limit}`
    );

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie Page must Number", async () => {
    const response = await request(app).get(
      `/movies/genres/action?page=tes&limit=${limit}`
    );

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie Limit must Number", async () => {
    const response = await request(app).get(
      `/movies/genres/action?page=${page}&limit=tes`
    );

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie Page and Limit Must Number", async () => {
    const response = await request(app).get(
      "/movies/genres/action?page=tes&limit=tes"
    );

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("/Movie Detail", () => {
  it("Get Detail Movie", async () => {
    const response = await request(app).get(`/movies/${movieId}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get Movie by Review Limit", async () => {
    const response = await request(app).get(
      `/movies/${movieId}?revlimit=${revLimit}`
    );

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Get Movie by Review Limit and Review Page", async () => {
    const response = await request(app).get(
      `/movies/${movieId}?revlimit=${revLimit}&revpage=${revPage}`
    );

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Invalid Movie's Id", async () => {
    const response = await request(app).get(
      `/movies/${randomHexKey}?revlimit=${revLimit}&revpage=${revPage}`
    );
    // recheck cause u pijet-pijet only
    expect(response.statusCode).toEqual(500);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Wrong Route", async () => {
    const response = await request(app).get(
      `/movie/${movieId}?revlimit=${revLimit}&revpage=${revPage}`
    );

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie's Review Limit must Number", async () => {
    const response = await request(app).get(`/movies/${movieId}?revlimit=tes`);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie's Page must Number", async () => {
    const response = await request(app).get(`/movies/${movieId}?revpage=tes`);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Movie's Review Page and Limit Must Number", async () => {
    const response = await request(app).get(
      `/movies/${movieId}?revlimit=tes&revpage=tes`
    );

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });
});
