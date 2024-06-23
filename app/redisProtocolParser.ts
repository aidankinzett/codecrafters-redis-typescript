/**
 * Parses the input using Redis serialization protocol
 *
 * @see https://redis.io/docs/latest/develop/reference/protocol-spec
 * @param input The input to be parsed
 */
export const redisProtocolParser = (input: string) => {
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

  if (lines[0].startsWith("+")) {
    return [lines[0].slice("+".length)];
  }
};
