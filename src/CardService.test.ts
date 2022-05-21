import { DataSource } from "typeorm";
import { appDataSourceFactory } from "./AppDataSource";
import { CardEntity } from "./CardEntity";
import { CardService, CreateCardModel } from "./CardService";

describe("CreateCard tests", () => {
  let AppDataSource: DataSource;
  let cardService: CardService;
  const testCreateCardModel: CreateCardModel = {
    pasteId: "test",
    pasteEditCode: "test",
    deck: "test",
  };

  beforeEach(async () => {
    AppDataSource = appDataSourceFactory(":memory:");
    await AppDataSource.initialize();
    cardService = new CardService(
      AppDataSource.getRepository<CardEntity>(CardEntity)
    );
  });
  afterEach(async () => {
    await AppDataSource.destroy();
  });

  test("Count more than one", async () => {
    await cardService.createCardAsync(testCreateCardModel);
    expect(await cardService.repository.count()).toBe(1);
  });
  test("Mutating card's id", async () => {
    const firstCard = await cardService.createCardAsync(testCreateCardModel);
    const secondCard = await cardService.createCardAsync(testCreateCardModel);
    expect(firstCard.id).toBe(1);
    expect(secondCard.id).toBe(2);
  });
});
