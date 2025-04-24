import { Composer, type Context } from "telegraf";
import type { TelemetryClient } from "../core/TelemetryClient";

export const telegrafMiddleware = (
  client: TelemetryClient,
): Composer<Context> => {
  return new Composer<Context>((ctx, next) => {
    client.update(ctx.update).finally(next);
  });
};
