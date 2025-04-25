import { mkdirpSync } from "mkdirp";
import { appendFile, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

class Wal<T> {
  constructor(private filename: string) {
    mkdirpSync(dirname(this.filename));
  }

  public async append(data: T | T[]) {
    const text = Array.isArray(data)
      ? data.map((o) => JSON.stringify(o)).join("\n")
      : JSON.stringify(data);

    await appendFile(this.filename, text + "\n", "utf-8");
  }

  public async readAll() {
    try {
      const text = await readFile(this.filename, "utf-8");

      return text
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => JSON.parse(line) as T);
    } catch (e) {
      console.error(e);

      return [];
    }
  }

  public async clear() {
    await writeFile(this.filename, "", "utf-8");
  }
}

export class SendQueue<T> {
  private wal: Wal<T>;
  private processing = false;

  constructor(
    private sender: (data: T) => Promise<boolean | void>,
    private walFilename: string,
  ) {
    this.wal = new Wal(this.walFilename);
  }

  public push(data: T) {
    void this.wal.append(data);

    void this.processQueue();
  }

  private async processQueue() {
    if (this.processing) return;

    this.processing = true;

    try {
      const rest = await this.wal.readAll();

      for (let i = 0; i < rest.length; i++) {
        const record = rest[i];

        try {
          const success = await this.sender(record);

          if (success != false) {
            rest.splice(i--, 1);
          }
        } catch (e) {
          console.error(e);
        }
      }

      try {
        await this.wal.clear();

        await this.wal.append(rest);
      } catch (e) {
        console.error(e);
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.processing = false;
    }
  }
}
