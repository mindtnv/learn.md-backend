import fastify, { FastifyInstance } from "fastify";
import { appDataSourceFactory } from "../AppDataSource";
import { CardService } from "../CardService";
import { CardEntity } from "../CardEntity";
import { DataSource } from "typeorm";
import { createLearnPostHandler } from "./post";
import { testCreateCardModel } from "../CardService.test";

let app: FastifyInstance;
let cardService: CardService;
let AppDataSource: DataSource;

beforeEach(async () => {
  AppDataSource = appDataSourceFactory(":memory:");
  await AppDataSource.initialize();
  cardService = new CardService(
    AppDataSource.getRepository<CardEntity>(CardEntity)
  );
  app = fastify();
  app.post("/learn/:id", createLearnPostHandler(app, cardService));
});
afterEach(async () => {
  await AppDataSource.destroy();
});

describe("Response Tests", () => {
  test("400 on empty body", async () => {
    const response = await app.inject({
      method: "POST",
      path: "/learn/1",
    });
    expect(response.statusCode).toBe(400);
  });
  test("404 on incorrect id", async () => {
    const response = await app.inject({
      method: "POST",
      path: "/learn/asdf1",
      payload: JSON.stringify({ difficult: "easy" }),
      headers: {
        "content-type": "application/json",
      },
    });
    expect(response.statusCode).toBe(404);
  });
  test("400 on incorrect difficult", async () => {
    const response = await app.inject({
      method: "POST",
      path: "/learn/1",
      payload: JSON.stringify({ difficult: "easy-easy" }),
      headers: {
        "content-type": "application/json",
      },
    });
    expect(response.statusCode).toBe(400);
  });
  test("404 on zero cards", async () => {
    const response = await app.inject({
      method: "POST",
      path: "/learn/1",
      payload: JSON.stringify({ difficult: "easy" }),
      headers: {
        "content-type": "application/json",
      },
    });
    expect(response.statusCode).toBe(404);
  });
  test("200 when OK", async () => {
    await cardService.createCardAsync(testCreateCardModel);
    const response = await app.inject({
      method: "POST",
      path: "/learn/1",
      payload: JSON.stringify({ difficult: "easy" }),
      headers: {
        "content-type": "application/json",
      },
    });
    expect(response.statusCode).toBe(200);
  });
});
