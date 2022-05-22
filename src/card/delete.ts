import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CardService } from "../CardService";

export interface CardDeleteParams {
  id: string;
}

export const createCardDeleteHandler = (
  app: FastifyInstance,
  cardService: CardService
) => {
  return async (
    request: FastifyRequest<{ Body: string; Params: CardDeleteParams }>,
    reply: FastifyReply
  ) => {
    try {
      const card = await cardService.getCard(
        Number.parseInt(request.params.id)
      );
      if (card === null) return reply.code(404).send();

      return await cardService.deleteCardAsync({ id: card.id });
    } catch (e) {
      console.error(e);
      return reply.code(500).send();
    }
  };
};
