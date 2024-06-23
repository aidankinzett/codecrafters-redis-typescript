import { bulkString } from "./bulkString";

export const array = (input: string[]) => {
  const len = input.length;

  if (len === 0) return "*0\r\n";

  return input.reduce((acc: string, cur: string) => {
    acc += bulkString(cur);
    return acc;
  }, `*${len}\r\n`);
};
