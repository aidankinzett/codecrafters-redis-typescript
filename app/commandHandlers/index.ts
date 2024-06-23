import { RedisCommand, RedisCommandHandler } from "./types";
import { echoHandler } from "./echoHandler";
import { pingHandler } from "./pingHandler";
import { setHandler } from "./setHandler";
import { getHandler } from "./getHandler";
import { infoHandler } from "./infoHandler";

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
