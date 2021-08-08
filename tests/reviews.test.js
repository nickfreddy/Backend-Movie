// Amri's Code
const request = require("supertest");
const faker = require("faker");
const jwt = require("jsonwebtoken");
const app = require("../index");
const { movie, user, review } = require("../models");
let userToken = "";
let otherUserToken = "";
let adminToken = "";
let movieId = "";
let reviewId = "";

beforeAll(async () => {
  const mainUser = await user.create({
    username: faker.name.findName(),
    email: faker.internet.email(),
    password: "Aneh123!!",
  });

  const otherUser = await user.create({
    username: faker.name.findName(),
    email: faker.internet.email(),
    password: "Aneh123!!",
  });

  const movieTest = await movie.create({
    title: "Movie Test",
    genres: "action",
    release_year: "2021",
    poster: "www.testposter.com",
    trailer: "www.testtrailer.com",
    synopsis: "Lorem ipsum",
  });

  const admin = await user.create({
    username: faker.name.findName(),
    email: faker.internet.email(),
    password: "Aneh123!!",
    role: "admin",
  });

  movieId = movieTest._id;

  const reviewTest = await review.create({
    user_id: otherUser._id,
    movie_id: movieId,
    rating: "3",
    comment: "this the review movie",
  });

  reviewId = reviewTest._id;
  userToken = jwt.sign({ user: mainUser._id }, process.env.JWT_SECRET);
  otherUserToken = jwt.sign({ user: otherUser._id }, process.env.JWT_SECRET);
  adminToken = jwt.sign({ user: admin._id }, process.env.JWT_SECRET);
});

describe("/reviews GET", () => {
  it("Reviews loaded", async () => {
    const response = await request(app).get("/reviews");
    //   .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Reviews not found", async () => {
    const response = await request(app).get("/revie");
    //   .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("/reviews POST", () => {
  it("Review must be created", async () => {
    const response = await request(app)
      .post(`/movies/${movieId}/reviews`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        rating: "3",
        comment: "This movie is awesome",
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("rating has not been inputed", async () => {
    const response = await request(app)
      .post(`/movies/${movieId}/reviews`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        rating: "",
        comment: "This movie is awesome",
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("comment should not be empty", async () => {
    const response = await request(app)
      .post(`/movies/${movieId}/reviews`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        rating: "3",
        comment: "",
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("rating more than 5", async () => {
    const response = await request(app)
      .post(`/movies/${movieId}/reviews`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        rating: "20",
        comment: "This movie is awesome",
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("User should not make review more than one on a movie", async () => {
    const response = await request(app)
      .post(`/movies/${movieId}/reviews`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        rating: "20",
        comment: "This movie is awesome",
      });
    expect(response.statusCode).toEqual(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("User has not been sign in/ forbidden access", async () => {
    const response = await request(app)
      .post(`/movies/${movieId}/reviews`)
      //   .set("Authorization", `Bearer ${userToken}`)
      .send({
        rating: "20",
        comment: "This movie is awesome",
      });

    expect(response.statusCode).toEqual(403);
    expect(response.body).toBeInstanceOf(Object);
  });

  describe("/reviews PUT", () => {
    it("Review has been updated", async () => {
      const response = await request(app)
        .put(`/movies/${movieId}/reviews/${reviewId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          rating: "4",
          comment: "I change my mind, it's the other hand",
        });

      expect(response.statusCode).toEqual(201);
      expect(response.body).toBeInstanceOf(Object);
    });

    it("rating has not been inputed", async () => {
      const response = await request(app)
        .put(`/movies/${movieId}/reviews/${reviewId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          rating: "",
          comment: "I change my mind, it's the other hand",
        });

      expect(response.statusCode).toEqual(400);
      expect(response.body).toBeInstanceOf(Object);
    });

    it("comment should not be empty", async () => {
      const response = await request(app)
        .put(`/movies/${movieId}/reviews/${reviewId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          rating: "5",
          comment: "",
        });

      expect(response.statusCode).toEqual(400);
      expect(response.body).toBeInstanceOf(Object);
    });

    it("rating more than 5", async () => {
      const response = await request(app)
        .post(`/movies/${movieId}/reviews/${reviewId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          rating: "20",
          comment: "I change my mind, it's the other hand",
        });

      expect(response.statusCode).toEqual(404);
      expect(response.body).toBeInstanceOf(Object);
    });

    it("User has not been sign in/ forbidden access", async () => {
      const response = await request(app)
        .put(`/movies/${movieId}/reviews/${reviewId}`)
        //   .set("Authorization", `Bearer ${userToken}`)
        .send({
          rating: "4",
          comment: "I change my mind, it's the other hand",
        });

      expect(response.statusCode).toEqual(403);
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe("/reviews DELETE", () => {
    it("Reviews not found/ routes not found", async () => {
      const response = await request(app)
        .delete(`/movies/${movieId}/reviews/brokenid`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.statusCode).toEqual(500);
      expect(response.body).toBeInstanceOf(Object);
    });

    it("Missing authentication header", async () => {
      const response = await request(app).delete(
        `/movies/${movieId}/reviews/${reviewId}`
      );
      //   .set("Authorization", `Bearer ${userToken}`);

      expect(response.statusCode).toEqual(403);
      expect(response.body).toBeInstanceOf(Object);
    });

    it("Missing token", async () => {
      const response = await request(app)
        .delete(`/movies/${movieId}/reviews/${reviewId}`)
        .set("Authorization", `Bearer hellotest`);

      expect(response.statusCode).toEqual(403);
      expect(response.body).toBeInstanceOf(Object);
    });

    it("Review deleted", async () => {
      const response = await request(app)
        .delete(`/movies/${movieId}/reviews/${reviewId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toBeInstanceOf(Object);
    });
  });
});
