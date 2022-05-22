import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CardService } from "../CardService";
import { getBody } from "../utils";

export interface CardPostModel {
  title: string;
  deck: string;
  pasteId: string;
  pasteEditCode: string;
}

export const createCardPostHandler = (
  app: FastifyInstance,
  cardService: CardService
) => {
  return async (
    request: FastifyRequest<{ Body: string }>,
    reply: FastifyReply
  ) => {
    try {
      if (!request.body) return reply.code(400).send();

      const body = getBody<CardPostModel>(request.body);
      if (!body.title || !body.deck || !body.pasteId)
        return reply.code(400).send();

      return await cardService.createCardAsync({ ...body });
    } catch (e) {
      console.error(e);
      return reply.code(500).send();
    }
  };
};
