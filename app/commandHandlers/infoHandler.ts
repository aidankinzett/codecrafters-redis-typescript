import { RedisCommandHandler } from "./types";
import { bulkString } from "../RESP/bulkString";
import { config } from "../config";

export const infoHandler: RedisCommandHandler = (connection, data) => {
  const output = bulkString(
    [
      `role:${config.role}`,
      "master_replid:8371b4fb1155b71f4a04d3e1bc3e18c4a990aeeb",
      "master_repl_offset:0",
    ].join("\r\n"),
  );

  console.log(output);
  connection.write(output);
};
