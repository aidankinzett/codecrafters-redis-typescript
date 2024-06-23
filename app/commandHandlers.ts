import * as net from "net";
import { memory } from "./memory";
import { simpleString } from "./RESP/simpleString";
import { bulkString, nullBulkString } from "./RESP/bulkString";
import { addMilliseconds, isAfter } from "date-fns";
import { config } from "./config";

/**
 * Supported redis commands
 */
export type RedisCommand = "PING" | "ECHO" | "SET" | "GET" | "INFO";

type RedisCommandHandler = (connection: net.Socket, data: string[]) => void;

const echoHandler: RedisCommandHandler = (connection, data) => {
  connection.write(simpleString(data[1]));
};

const pingHandler: RedisCommandHandler = (connection) => {
  connection.write(simpleString("PONG"));
};

const setHandler: RedisCommandHandler = (connection, data) => {
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

const getHandler: RedisCommandHandler = (connection, data) => {
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

const infoHandler: RedisCommandHandler = (connection, data) => {
  connection.write(bulkString(`role:${config.role}`));
};

/**
 * Maps redis commands to their handlers
 */
export const commandHandlers: Record<RedisCommand, RedisCommandHandler> = {
  ECHO: echoHandler,
  PING: pingHandler,
  SET: setHandler,
  GET: getHandler,
  INFO: infoHandler,
};
