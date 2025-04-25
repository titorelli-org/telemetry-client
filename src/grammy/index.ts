import { Composer, type Context } from "grammy";
import type { TelemetryClient } from "../core/TelemetryClient";

export const grammyMiddleware = (client: TelemetryClient): Composer<Context> =>
  new Composer<Context>(async (ctx, next) => {
    void next();

    void client.update({
      update: ctx.update,
      author: await ctx.getAuthor(),
      chat: await ctx.getChat(),
      me: await ctx.api.getMe(),
    });
  });
