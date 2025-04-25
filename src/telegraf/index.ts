import { Composer, type Context } from "telegraf";
import type { TelemetryClient } from "../core/TelemetryClient";

export const telegrafMiddleware = (
  client: TelemetryClient,
): Composer<Context> =>
  new Composer<Context>(async (ctx, next) => {
    void next();

    void client.update({
      update: ctx.update,
      author: ctx.from ? await ctx.getChatMember(ctx.from.id) : null,
      chat: await ctx.getChat(),
      me: await ctx.telegram.getMe(),
    });
  });
