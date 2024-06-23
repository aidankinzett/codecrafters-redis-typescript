import * as net from "net";
import { memory } from "./memory";
import { simpleString } from "./RESP/simpleString";
import { bulkString } from "./RESP/bulkString";

/**
 * Supported redis commands
 */
export type RedisCommand = "PING" | "ECHO" | "SET" | "GET";

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

  // set value in memory
  memory[key] = value;

  connection.write(simpleString("OK"));
};

const getHandler: RedisCommandHandler = (connection, data) => {
  const key = data[1];

  // get value from memory
  const value = memory[key];

  connection.write(bulkString(value));
};

/**
 * Maps redis commands to their handlers
 */
export const commandHandlers: Record<RedisCommand, RedisCommandHandler> = {
  ECHO: echoHandler,
  PING: pingHandler,
  SET: setHandler,
  GET: getHandler,
};
