import * as net from "net";

/**
 * Supported redis commands
 */
export type RedisCommand = "PING" | "ECHO";

type RedisCommandHandler = (connection: net.Socket, data: string[]) => void;

const echoHandler: RedisCommandHandler = (connection, data) => {
  connection.write(`+${data[1]}\r\n`);
};

const pingHandler: RedisCommandHandler = (connection) => {
  connection.write("+PONG\r\n");
};

/**
 * Maps redis commands to their handlers
 */
export const commandHandlers: Record<RedisCommand, RedisCommandHandler> = {
  ECHO: echoHandler,
  PING: pingHandler,
};
