import { RedisCommandHandler } from "./types";
import { simpleString } from "../RESP/simpleString";

export const pingHandler: RedisCommandHandler = (connection) => {
  connection.write(simpleString("PONG"));
};
