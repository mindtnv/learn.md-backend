import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CardService } from "../CardService";

export const createCardsGetHandler = (
  app: FastifyInstance,
  cardService: CardService
) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      return await cardService.getActiveCardsAsync();
    } catch (e) {
      console.error(e);
      return reply.code(500).send();
    }
  };
};
