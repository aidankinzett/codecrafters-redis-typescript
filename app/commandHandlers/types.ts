import net from "net";

export type RedisCommand = "PING" | "ECHO" | "SET" | "GET" | "INFO";

export type RedisCommandHandler = (
  connection: net.Socket,
  data: string[],
) => void;
