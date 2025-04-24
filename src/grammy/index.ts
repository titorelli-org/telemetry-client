import { Composer } from "grammy";
import type { TelemetryClient } from "../core/TelemetryClient";

export const grammyMiddleware = (client: TelemetryClient) => {
  return new Composer((ctx, next) => {
    client.update(ctx.update).finally(next);
  });
};
