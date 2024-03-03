import { v4 as uuid } from "uuid";
import fs from "fs";
import { promises as fsPromises } from "fs";
import path from "path";

const logEvents = async (message: string, logName: string) => {
  const dateOrTime = new Date();
  const logItem = `${dateOrTime.toUTCString()}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }

    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

const logger = (req: any, res: any, next: any) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
  console.log(`${req.method} ${req.path}`);
  next();
};

export { logger, logEvents };
