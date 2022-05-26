import { LessThanOrEqual, Repository } from "typeorm";
import { CardEntity } from "./CardEntity";
import { addDays, clearTime } from "./utils";

export interface CreateCardModel {
  pasteId: string;
  pasteEditCode: string;
  title: string;
  deck: string;
}

export interface LearnCardModel {
  id: number;
  difficult: string;
}

export interface DeleteCardModel {
  id: number;
}

export const cardFactory = (model: CreateCardModel) => {
  if (model.deck === "") throw new Error("deck can't be empty string");
  if (model.pasteId === "") throw new Error("pasteId can't be empty string");
  if (model.pasteEditCode === "")
    throw new Error("pasteEditCode can't be empty string");

  const card = new CardEntity();
  card.deck = model.deck;
  card.pasteId = model.pasteId;
  card.pasteEditCode = model.pasteEditCode;
  card.createDate = new Date();
  card.learnDate = clearTime(card.createDate);
  card.interval = 0;
  card.stage = 0;
  card.title = model.title;

  return card;
};

export const intervalFunction = (stage: number) => {
  switch (stage) {
    case 0:
      return 0;
    case 1:
      return 5;
    case 2:
      return 3;
    case 3:
      return 8;
    case 4:
      return 14;
    default:
      return 30;
  }
};

export class CardService {
  constructor(readonly repository: Repository<CardEntity>) {}

  async createCardAsync(model: CreateCardModel): Promise<CardEntity> {
    const card = cardFactory(model);
    await this.repository.save(card);
    return card;
  }

  async learnCardAsync(model: LearnCardModel): Promise<CardEntity> {
    const card = await this.repository.findOne({
      where: {
        id: model.id,
      },
    });

    if (model.difficult === "easy") {
      card.stage += 1;
    } else if (model.difficult === "hard") {
      card.stage = 0;
    }

    card.interval = intervalFunction(card.stage);
    card.learnDate = clearTime(addDays(card.learnDate, card.interval));
    await this.repository.save(card);
    return card;
  }

  async deleteCardAsync(model: DeleteCardModel): Promise<CardEntity> {
    const card = await this.repository.findOne({
      where: {
        id: model.id,
      },
    });

    await this.repository.remove(card);
    return card;
  }

  async getActiveCardsAsync(date: Date = new Date()): Promise<CardEntity[]> {
    return await this.repository.find({
      where: {
        learnDate: LessThanOrEqual(date),
      },
    });
  }

  async getCard(id: number): Promise<CardEntity | null> {
    const notes = await this.repository.find({
      where: {
        id: id,
      },
      take: 1,
    });

    return notes.length > 0 ? notes[0] : null;
  }
}
