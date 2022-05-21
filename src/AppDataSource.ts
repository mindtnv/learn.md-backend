import { DataSource } from "typeorm";
import { CardEntity } from "./CardEntity";

export const appDataSourceFactory = (dbLocation: string) =>
  new DataSource({
    type: "sqlite",
    database: dbLocation,
    synchronize: true,
    logging: false,
    entities: [CardEntity],
  });
