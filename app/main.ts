import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server: net.Server = net.createServer((connection: net.Socket) => {
  // Handle connection
  connection.on("data", (data) => {
    const parsedData = redisProtocolParser(data.toString());

    if (!parsedData) throw Error("Data parsing failed");

    redisCommandHandlers[parsedData[0].toUpperCase() as RedisCommand](
      connection,
      parsedData,
    );
  });
});

server.listen(6379, "127.0.0.1");

const redisProtocolParser = (input: string) => {
  // break string up by lines
  const lines = input.split("\r\n");

  // split based on output type using first line
  if (lines[0].startsWith("*")) {
    // output is an array
    const output: string[] = [];

    const remainingLines = lines.slice(1);

    remainingLines.forEach((line) => {
      // if it starts with $ then return
      // this indicates the length of the next string
      if (line.startsWith("$")) return;

      // if line is empty then return
      if (line === "") return;

      // otherwise add to array
      output.push(line);
    });

    return output;
  }
};

type RedisCommand = "PING" | "ECHO";

const redisCommandHandlers: Record<
  RedisCommand,
  (connection: net.Socket, data: string[]) => void
> = {
  ECHO: (connection, data) => {
    connection.write(`+${data[1]}\r\n`);
  },
  PING: (connection) => {
    connection.write("+PONG\r\n");
  },
};
