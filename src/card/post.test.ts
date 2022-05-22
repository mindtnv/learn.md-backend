import fastify, { FastifyInstance } from "fastify";
import { appDataSourceFactory } from "../AppDataSource";
import { CardService } from "../CardService";
import { CardEntity } from "../CardEntity";
import { DataSource } from "typeorm";
import { CardPostModel, createCardPostHandler } from "./post";

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
  app.post("/card", createCardPostHandler(app, cardService));
});
afterEach(async () => {
  await AppDataSource.destroy();
});

describe("Response Tests", () => {
  test("400 without body", async () => {
    const response = await app.inject({
      method: "POST",
      path: "/card",
      headers: {
        "content-type": "application/json",
      },
    });
    expect(response.statusCode).toBe(400);
  });
  test("400 on validation error", async () => {
    const cardModel: CardPostModel = {
      pasteId: "test",
      pasteEditCode: "test",
      deck: "",
      title: "test",
    };
    const response = await app.inject({
      method: "POST",
      path: "/card",
      payload: JSON.stringify(cardModel),
      headers: {
        "content-type": "application/json",
      },
    });
    expect(response.statusCode).toBe(400);
  });
  test("200 on OK", async () => {
    const cardModel: CardPostModel = {
      pasteId: "test",
      pasteEditCode: "test",
      deck: "test",
      title: "test",
    };
    const response = await app.inject({
      method: "POST",
      path: "/card",
      payload: JSON.stringify(cardModel),
      headers: {
        "content-type": "application/json",
      },
    });
    expect(response.statusCode).toBe(200);
  });
});
