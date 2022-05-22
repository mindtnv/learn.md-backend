import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CardService } from "../CardService";
import { getBody } from "../utils";

export interface LearnPostModel {
  difficult: "easy" | "normal" | "hard";
}

export interface LearnPostParams {
  id: string;
}

export const createLearnPostHandler = (
  app: FastifyInstance,
  cardService: CardService
) => {
  return async (
    request: FastifyRequest<{ Body: string; Params: LearnPostParams }>,
    reply: FastifyReply
  ) => {
    try {
      if (!request.body) return reply.code(400).send();

      const body = getBody<LearnPostModel>(request.body);
      const difficult = body.difficult.toLowerCase();
      if (!["easy", "normal", "hard"].some((x) => x === difficult))
        return reply.code(400).send();

      const id = Number.parseInt(request.params.id);
      if (isNaN(id)) return reply.code(404).send(404);

      const card = await cardService.getCard(id);
      if (card === null) return reply.code(404).send();

      return await cardService.learnCardAsync({
        id: card.id,
        difficult,
      });
    } catch (e) {
      console.error(e);
      return reply.code(500).send();
    }
  };
};
