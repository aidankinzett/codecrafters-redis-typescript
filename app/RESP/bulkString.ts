export const bulkString = (input: string) => `$${input.length}\r\n${input}\r\n`;

export const nullBulkString = "$-1\r\n";
