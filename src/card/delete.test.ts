import fastify, { FastifyInstance } from "fastify";
import { appDataSourceFactory } from "../AppDataSource";
import { CardService } from "../CardService";
import { CardEntity } from "../CardEntity";
import { DataSource } from "typeorm";
import { createCardDeleteHandler } from "./delete";
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
  app.delete("/card/:id", createCardDeleteHandler(app, cardService));
});
afterEach(async () => {
  await AppDataSource.destroy();
});

describe("Response Tests", () => {
  test("404 with zero cards", async () => {
    const request = await app.inject({
      method: "DELETE",
      path: "/card/1",
    });
    expect(request.statusCode).toBe(404);
  });
  test("200 with success", async () => {
    const card = await cardService.createCardAsync(testCreateCardModel);
    const response = await app.inject({
      method: "DELETE",
      path: `/card/${card.id}`,
    });
    expect(response.statusCode).toBe(200);
  });
});
