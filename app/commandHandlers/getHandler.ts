import { RedisCommandHandler } from "./types";
import { memory } from "../memory";
import { isAfter } from "date-fns";
import { bulkString, nullBulkString } from "../RESP/bulkString";

export const getHandler: RedisCommandHandler = (connection, data) => {
  const key = data[1];

  // get value from memory
  const { value, expiry } = memory[key];

  // if the current date is after the expiry
  if (expiry && isAfter(new Date(), expiry)) {
    connection.write(nullBulkString);
    return;
  }

  connection.write(bulkString(value));
};
