import "reflect-metadata";
import fastify from "fastify";
import { CardEntity } from "./CardEntity";
import { appDataSourceFactory } from "./AppDataSource";
import { createCardsGetHandler } from "./cards/get";
import { CardService } from "./CardService";
import { createCardPostHandler } from "./card/post";
import { createLearnPostHandler } from "./learn/post";
import { createCardDeleteHandler } from "./card/delete";

async function main() {
  const AppDataSource = appDataSourceFactory(process.env.APP_DB_LOCATION);
  await AppDataSource.initialize();
  const cardService = new CardService(
    AppDataSource.getRepository<CardEntity>(CardEntity)
  );
  const app = fastify();
  console.log("Starting app...");
  app.register(require("@fastify/cors"), {
    origin: ["http://localhost:3000", "https://learnmd.gbms.site"],
  });
  app.get("/cards", createCardsGetHandler(app, cardService));
  app.post("/card", createCardPostHandler(app, cardService));
  app.post("/learn/:id", createLearnPostHandler(app, cardService));
  app.delete("/card/:id", createCardDeleteHandler(app, cardService));
  const address = "0.0.0.0";
  const port = 8000;
  await app.listen(port, address);
  console.log(`Server started ad ${address}:${port}`);
}

main();
