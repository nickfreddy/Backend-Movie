// Adib's Code
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

describe("/movies POST", () => {
  it("Success Create Movie", async () => {
    const response = await request(app)
      .post(`/movies`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({
        title: "Movie",
        genres: "romance, comedy",
        release_year: "2021",
        poster: "www.testposter.com",
        trailer: "www.testtrailer.com",
        synopsis: "Lorem ipsum",
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Forbidden User", async () => {
    const response = await request(app)
      .post(`/movies`)
      .set({ Authorization: `Bearer ${userToken}` })
      .send({
        title: "Movie",
        genres: "romance, comedy",
        release_year: "2021",
        poster: "www.testposter.com",
        trailer: "www.testtrailer.com",
        synopsis: "Lorem ipsum",
      });

    expect(response.statusCode).toEqual(403);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Invalid Genre(s)", async () => {
    const response = await request(app)
      .post(`/movies`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({
        title: "Movie",
        genres: "monkey wrench",
        release_year: "2021",
        poster: "www.testposter.com",
        trailer: "www.testtrailer.com",
        synopsis: "Lorem ipsum",
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Year is Not Valid", async () => {
    const response = await request(app)
      .post(`/movies`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({
        title: "Movie",
        genres: "romance, comedy",
        release_year: "20210",
        poster: "www.testposter.com",
        trailer: "www.testtrailer.com",
        synopsis: "Lorem ipsum",
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Title Cannot be Empty", async () => {
    const response = await request(app)
      .post(`/movies`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({
        title: "",
        genres: "romance, comedy",
        release_year: "2021",
        poster: "www.testposter.com",
        trailer: "www.testtrailer.com",
        synopsis: "Lorem ipsum",
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Synopsis Cannot be Empty", async () => {
    const response = await request(app)
      .post(`/movies`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({
        title: "Movie",
        genres: "romance, comedy",
        release_year: "2021",
        poster: "www.testposter.com",
        trailer: "www.testtrailer.com",
        synopsis: "",
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Wrong Route", async () => {
    const response = await request(app)
      .post(`/movie`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({
        title: "Movie",
        genres: "romance, comedy",
        release_year: "2021",
        poster: "www.testposter.com",
        trailer: "www.testtrailer.com",
        synopsis: "Lorem ipsum",
      });

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Criteria Must be Filled", async () => {
    const response = await request(app)
      .post(`/movies`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({});

    expect(response.statusCode).toEqual(500);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("/movies PUT", () => {
  it("Success Update Movie", async () => {
    const response = await request(app)
      .put(`/movies/${movieId}`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({
        title: "Movie Update",
        genres: "comedy",
        release_year: "2021",
        poster: "www.testposter.com",
        trailer: "www.testtrailer.com",
        synopsis: "Lorem ipsum",
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Wrong Route", async () => {
    const response = await request(app)
      .put(`/movie/${movieId}`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({
        title: "Movie Update",
        genres: "comedy",
        release_year: "2021",
        poster: "www.testposter.com",
        trailer: "www.testtrailer.com",
        synopsis: "Lorem ipsum",
      });

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("ID is Not Valid", async () => {
    const response = await request(app)
      .put(`/movies/${randomHexKey}`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({
        title: "Movie Update",
        genres: "comedy",
        release_year: "2021",
        poster: "www.testposter.com",
        trailer: "www.testtrailer.com",
        synopsis: "Lorem ipsum",
      });

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Invalid Genre(s)", async () => {
    const response = await request(app)
      .put(`/movies/${movieId}`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({
        title: "Movie Update",
        genres: "comedys",
        release_year: "2021",
        poster: "www.testposter.com",
        trailer: "www.testtrailer.com",
        synopsis: "Lorem ipsum",
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Year is Not Valid", async () => {
    const response = await request(app)
      .put(`/movies/${movieId}`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({
        title: "Movie Update",
        genres: "comedy",
        release_year: "20210",
        poster: "www.testposter.com",
        trailer: "www.testtrailer.com",
        synopsis: "Lorem ipsum",
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Title Cannot be Empty", async () => {
    const response = await request(app)
      .put(`/movies/${movieId}`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({
        title: "",
        genres: "comedy",
        release_year: "2021",
        poster: "www.testposter.com",
        trailer: "www.testtrailer.com",
        synopsis: "Lorem ipsum",
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Synopsis Cannot be Empty", async () => {
    const response = await request(app)
      .put(`/movies/${movieId}`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({
        title: "Movie Update",
        genres: "comedy",
        release_year: "2021",
        poster: "www.testposter.com",
        trailer: "www.testtrailer.com",
        synopsis: "",
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Criteria Must be Filled", async () => {
    const response = await request(app)
      .put(`/movies/${movieId}`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({});

    expect(response.statusCode).toEqual(500);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("User Cannot Update Movies", async () => {
    const response = await request(app)
      .put(`/movies/${movieId}`)
      .set({ Authorization: `Bearer ${userToken}` })
      .send({
        title: "Movie Update",
        genres: "comedy",
        release_year: "2021",
        poster: "www.testposter.com",
        trailer: "www.testtrailer.com",
        synopsis: "Lorem ipsum",
      });

    expect(response.statusCode).toEqual(403);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Missing Token", async () => {
    const response = await request(app)
      .put(`/movies/${movieId}`)
      .set("Authorization", `Bearer HELLO`)
      .send({
        title: "Movie Update",
        genres: "comedy",
        release_year: "2021",
        poster: "www.testposter.com",
        trailer: "www.testtrailer.com",
        synopsis: "Lorem ipsum",
      });

    expect(response.statusCode).toEqual(403);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Missing Authorization Header", async () => {
    const response = await request(app).put(`/users/${mainUserId}`).send({
      title: "Movie Update",
      genres: "comedy",
      release_year: "2021",
      poster: "www.testposter.com",
      trailer: "www.testtrailer.com",
      synopsis: "Lorem ipsum",
    });

    expect(response.statusCode).toEqual(403);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("/movies DEL", () => {
  it("ID is not valid", async () => {
    const response = await request(app)
      .delete(`/movies/${randomHexKey}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("User Cannot Delete Any Movie", async () => {
    const response = await request(app)
      .delete(`/movies/${movieId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(403);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Missing Token", async () => {
    const response = await request(app)
      .delete(`/movie/${movieId}`)
      .set("Authorization", `Bearer HELLO`);

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Missing Authorization Header", async () => {
    const response = await request(app).delete(`/movies/${movieId}`);

    expect(response.statusCode).toEqual(403);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Success Delete Movie", async () => {
    const response = await request(app)
      .delete(`/movies/${movieId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });
});
