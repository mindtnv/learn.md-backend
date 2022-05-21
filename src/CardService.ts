import { Repository } from "typeorm";
import { CardEntity } from "./CardEntity";
import { clearTime } from "./utils";

export interface CreateCardModel {
  pasteId: string;
  pasteEditCode: string;
  deck: string;
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

  return card;
};

export class CardService {
  constructor(readonly repository: Repository<CardEntity>) {}

  async createCardAsync(model: CreateCardModel): Promise<CardEntity> {
    const card = cardFactory(model);
    await this.repository.save(card);
    return card;
  }
}
