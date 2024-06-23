import { RedisCommandHandler } from "./types";
import { bulkString } from "../RESP/bulkString";
import { config } from "../config";

export const infoHandler: RedisCommandHandler = (connection, data) => {
  connection.write(bulkString(`role:${config.role}`));
};
