import * as net from "net";
import { redisProtocolParser } from "./redisProtocolParser";
import { commandHandlers } from "./commandHandlers";
import minimist from "minimist";
import { config } from "./config";
import { RedisCommand } from "./commandHandlers/types";
import { simpleString } from "./RESP/simpleString";
import { array } from "./RESP/array";

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

if (args.port) {
  config.port = args.port;
}

if (args.replicaof) {
  config.role = "slave";
  config.masterUrl = args.replicaof.split(" ")[0];
  config.masterPort = parseInt(args.replicaof.split(" ")[1]);

  console.log(config);
}

server.listen(config.port, "127.0.0.1");

if (config.role === "slave" && config.masterUrl && config.masterPort) {
  const client = net.createConnection(
    { host: config.masterUrl, port: config.masterPort },
    () => {
      console.log("Connected to the master server");
      client.write(array(["PING"]));
    },
  );
  client.on("data", (data) => {
    console.log("Received from the master server:", data.toString());
    client.end();
  });
  client.on("end", () => {
    console.log("Disconnected from the master server");
  });
  client.on("error", (err) => {
    console.error("Client error:", err);
  });
}
