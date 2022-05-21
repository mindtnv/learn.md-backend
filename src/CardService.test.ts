import { DataSource } from "typeorm";
import { appDataSourceFactory } from "./AppDataSource";
import { CardEntity } from "./CardEntity";
import { CardService, CreateCardModel, intervalFunction } from "./CardService";
import { addDays, clearTime, getRandomNumber } from "./utils";

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

describe("CreateCard tests", () => {
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
  test("Dont accept empty fields", async () => {
    await expect(async () => {
      await cardService.createCardAsync({
        pasteId: "",
        deck: "",
        pasteEditCode: "",
      });
    }).rejects.toThrow();
  });
  test("Creating and Learning dates are equal", async () => {
    const card = await cardService.createCardAsync(testCreateCardModel);
    expect(card.learnDate).toStrictEqual(clearTime(card.createDate));
  });
});

describe("LearnCard Tests", () => {
  test("First-easy learn", async () => {
    const card = await cardService.createCardAsync(testCreateCardModel);
    const updatedCard = await cardService.learnCardAsync({
      id: card.id,
      difficult: "easy",
    });
    expect(updatedCard.learnDate.getHours()).toBe(0);
    expect(updatedCard.learnDate.getTime()).toBeGreaterThan(
      card.learnDate.getTime()
    );
    expect(updatedCard.learnDate.getDay()).toBe(
      addDays(card.learnDate, intervalFunction(updatedCard.stage)).getDay()
    );
  });

  test("First-normal learn", async () => {
    const card = await cardService.createCardAsync(testCreateCardModel);
    const updatedCard = await cardService.learnCardAsync({
      id: card.id,
      difficult: "normal",
    });
    expect(updatedCard.learnDate.getHours()).toBe(0);
    expect(updatedCard.learnDate.getTime()).toBe(card.learnDate.getTime());
  });

  test("First-hard learn", async () => {
    const card = await cardService.createCardAsync(testCreateCardModel);
    const updatedCard = await cardService.learnCardAsync({
      id: card.id,
      difficult: "normal",
    });
    expect(updatedCard.learnDate.getHours()).toBe(0);
    expect(updatedCard.learnDate.getTime()).toBe(card.learnDate.getTime());
  });

  test("Random-hard learn", async () => {
    let card = await cardService.createCardAsync(testCreateCardModel);
    let updatedCard: CardEntity;
    const n = getRandomNumber(3, 10);
    for (let i = 0; i < n; i++) {
      card = await cardService.learnCardAsync({
        id: card.id,
        difficult: getRandomNumber(0, 2) === 0 ? "easy" : "normal",
      });
    }

    updatedCard = await cardService.learnCardAsync({
      id: card.id,
      difficult: "hard",
    });

    expect(updatedCard.learnDate.getHours()).toBe(0);
    expect(updatedCard.learnDate.getTime()).toBe(card.learnDate.getTime());
    expect(updatedCard.stage).toBe(0);
    expect(updatedCard.interval).toBe(intervalFunction(updatedCard.stage));
  });

  test("Random-normal learn", async () => {
    let card = await cardService.createCardAsync(testCreateCardModel);
    let updatedCard: CardEntity;
    const n = getRandomNumber(3, 10);
    for (let i = 0; i < n; i++) {
      card = await cardService.learnCardAsync({
        id: card.id,
        difficult: getRandomNumber(0, 2) === 0 ? "easy" : "normal",
      });
    }

    updatedCard = await cardService.learnCardAsync({
      id: card.id,
      difficult: "normal",
    });

    expect(updatedCard.learnDate.getHours()).toBe(0);
    expect(updatedCard.learnDate.getTime()).toBe(
      addDays(card.learnDate, intervalFunction(card.stage)).getTime()
    );
    expect(updatedCard.stage).toBe(card.stage);
    expect(updatedCard.interval).toBe(intervalFunction(card.stage));
  });

  test("Random-easy learn", async () => {
    const card = await cardService.createCardAsync(testCreateCardModel);
    let updatedCard: CardEntity;
    let daysSum = 0;
    const n = getRandomNumber(5, 15);
    for (let i = 0; i < n; i++) {
      updatedCard = await cardService.learnCardAsync({
        id: card.id,
        difficult: "easy",
      });
      daysSum += updatedCard.interval;
    }

    expect(updatedCard.learnDate.getHours()).toBe(0);
    expect(updatedCard.learnDate.getTime()).toBe(
      addDays(card.learnDate, daysSum).getTime()
    );
    expect(updatedCard.stage).toBe(n);
    expect(updatedCard.interval).toBe(intervalFunction(updatedCard.stage));
  });
});

describe("DeleteCard Tests", () => {
  test("Count must be zero after deleting", async () => {
    const card = await cardService.createCardAsync(testCreateCardModel);
    expect(await cardService.repository.count()).toBe(1);
    await cardService.deleteCardAsync({
      id: card.id,
    });
    expect(await cardService.repository.count()).toBe(0);
  });
});
