import { simpleString } from "../RESP/simpleString";
import { RedisCommandHandler } from "./index";

export const echoHandler: RedisCommandHandler = (connection, data) => {
  connection.write(simpleString(data[1]));
};
