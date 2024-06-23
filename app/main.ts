import * as net from "net";
import { redisProtocolParser } from "./redisProtocolParser";
import { commandHandlers, RedisCommand } from "./commandHandlers";

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

server.listen(6379, "127.0.0.1");
