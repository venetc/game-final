import { createTRPCRouter, publicProcedure } from "../trpc";

export const roleRouter = createTRPCRouter({
  getAll: publicProcedure
    .meta({ description: "Get all rules including permissions" })
    .query(async ({ ctx }) => {
      const roles = await ctx.prisma.role.findMany({
        include: { permissions: true },
      });

      return roles;
    }),
});
