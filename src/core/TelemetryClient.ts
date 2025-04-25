import axios, { AxiosInstance } from "axios";

export type TelemetryClientConfig = {
  serviceUrl: string;
};

export class TelemetryClient {
  private serviceUrl: string;
  private axios: AxiosInstance;

  constructor({ serviceUrl }: TelemetryClientConfig) {
    this.serviceUrl = serviceUrl;
    this.axios = axios.create({ baseURL: this.serviceUrl });
  }

  public async update({
    update,
    author,
    chat,
    me,
  }: {
    update: any;
    author: any;
    chat: any;
    me: any;
  }) {
    const { data } = await this.axios.post<void>("/update", {
      update,
      author,
      chat,
      me,
    });

    return data;
  }
}
