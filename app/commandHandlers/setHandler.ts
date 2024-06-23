import { RedisCommandHandler } from "./types";
import { addMilliseconds } from "date-fns";
import { memory } from "../memory";
import { simpleString } from "../RESP/simpleString";

export const setHandler: RedisCommandHandler = (connection, data) => {
  const key = data[1];
  const value = data[2];
  let expiry: Date | undefined = undefined;

  // check for command argument
  const commandArgument = data[3];

  if (commandArgument?.toLowerCase() === "px") {
    expiry = addMilliseconds(new Date(), parseInt(data[4]));
    console.log(expiry);
  }

  // set value in memory
  memory[key] = { value, expiry };

  connection.write(simpleString("OK"));
};
