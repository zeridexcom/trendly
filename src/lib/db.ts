// Mock Prisma client for deployment without database
// Replace with real Prisma client when database is configured

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyArgs = any

export const prisma = {
    user: {
        findUnique: async (_args: AnyArgs) => null,
        findMany: async (_args?: AnyArgs) => [],
        create: async (_args: AnyArgs) => null,
        update: async (_args: AnyArgs) => null,
        delete: async (_args: AnyArgs) => null,
    },
    trend: {
        findUnique: async (_args: AnyArgs) => null,
        findMany: async (_args?: AnyArgs) => [],
        create: async (_args: AnyArgs) => null,
        update: async (_args: AnyArgs) => null,
        delete: async (_args: AnyArgs) => null,
    },
    idea: {
        findUnique: async (_args: AnyArgs) => null,
        findMany: async (_args?: AnyArgs) => [],
        create: async (_args: AnyArgs) => null,
        update: async (_args: AnyArgs) => null,
        delete: async (_args: AnyArgs) => null,
    },
    post: {
        findUnique: async (_args: AnyArgs) => null,
        findMany: async (_args?: AnyArgs) => [],
        create: async (_args: AnyArgs) => null,
        update: async (_args: AnyArgs) => null,
        delete: async (_args: AnyArgs) => null,
    },
    contentSlot: {
        findUnique: async (_args: AnyArgs) => null,
        findMany: async (_args?: AnyArgs) => [],
        create: async (_args: AnyArgs) => null,
        update: async (_args: AnyArgs) => null,
        delete: async (_args: AnyArgs) => null,
    },
    notification: {
        findUnique: async (_args: AnyArgs) => null,
        findMany: async (_args?: AnyArgs) => [],
        create: async (_args: AnyArgs) => null,
        update: async (_args: AnyArgs) => null,
        delete: async (_args: AnyArgs) => null,
    },
}
