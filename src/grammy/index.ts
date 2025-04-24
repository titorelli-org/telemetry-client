import { Composer, type Context } from "grammy";
import type { TelemetryClient } from "../core/TelemetryClient";

export const grammyMiddleware = (
  client: TelemetryClient,
): Composer<Context> => {
  return new Composer<Context>((ctx, next) => {
    client.update(ctx.update).finally(next);
  });
};
