import * as net from "net";
import { redisProtocolParser } from "./redisProtocolParser";
import { commandHandlers, RedisCommand } from "./commandHandlers";
import minimist from "minimist";
import { config } from "./config";

const server: net.Server = net.createServer((connection: net.Socket) => {
  // Handle connection
  connection.on("data", (data) => {
    const parsedData = redisProtocolParser(data.toString());

    if (!parsedData) throw Error("Data parsing failed");

    // get the command from the array
    const command = parsedData[0].toUpperCase() as RedisCommand;

    // run the command handler function
    commandHandlers[command](connection, parsedData);
  });
});

const args = minimist(process.argv.slice(2));

const PORT = args["port"] || 6379;

if (args.replicaof) {
  config.role = "slave";
}

server.listen(PORT, "127.0.0.1");
