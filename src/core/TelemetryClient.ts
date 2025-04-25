import path from "node:path";
import axios, { type AxiosInstance } from "axios";
import { SendQueue } from "./SendQueue";

export type TelemetryClientConfig = {
  serviceUrl: string;
  useQueue?: boolean;
};

export class TelemetryClient {
  private serviceUrl: string;
  private sendQueue?: SendQueue<any>;
  private axios: AxiosInstance;

  constructor({ serviceUrl, useQueue = false }: TelemetryClientConfig) {
    this.serviceUrl = serviceUrl;
    this.axios = axios.create({ baseURL: this.serviceUrl });

    if (useQueue) {
      this.sendQueue = this.createSendQueue();
    }
  }

  public async update(data: { update: any; author: any; chat: any; me: any }) {
    if (this.sendQueue) {
      await this.sendQueue?.push(data);
    } else {
      await this.send(data);
    }
  }

  public useQueue(enable: boolean = true) {
    if (enable) {
      if (this.sendQueue == null) {
        this.sendQueue = this.createSendQueue();
      }
    } else {
      delete this.sendQueue;
    }
  }

  private send = async ({
    update,
    author,
    chat,
    me,
  }: {
    update: any;
    author: any;
    chat: any;
    me: any;
  }) => {
    const { data } = await this.axios.post<void>("/update", {
      update,
      author,
      chat,
      me,
    });

    return data;
  };

  private createSendQueue() {
    return new SendQueue(
      this.send,
      path.join(process.cwd(), "data/updates-wal.jsonl"),
    );
  }
}
