import { Repository } from "typeorm";
import { CardEntity } from "./CardEntity";

export interface CreateCardModel {
  pasteId: string;
  pasteEditCode: string;
  deck: string;
}

export const cardFactory = (model: CreateCardModel) => {
  if (model.deck === "") throw new Error("deck can't be empty string");

  const card = new CardEntity();
  card.deck = model.deck;
  card.pasteId = model.pasteId;
  card.pasteEditCode = model.pasteEditCode;
  card.createDate = new Date();
  return card;
};

export class CardService {
  constructor(readonly repository: Repository<CardEntity>) {}

  async createNoteAsync(model: CreateCardModel): Promise<CardEntity> {
    const card = cardFactory(model);
    await this.repository.save(card);
    return card;
  }
}
