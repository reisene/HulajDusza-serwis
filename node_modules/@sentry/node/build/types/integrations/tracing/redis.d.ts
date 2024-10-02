interface RedisOptions {
    cachePrefixes?: string[];
}
/** To be able to preload all Redis OTel instrumentations with just one ID ("Redis"), all the instrumentations are generated in this one function  */
export declare const instrumentRedis: (() => void) & {
    id: string;
};
/**
 * Redis integration for "ioredis"
 *
 * Capture tracing data for redis and ioredis.
 */
export declare const redisIntegration: (options?: RedisOptions | undefined) => import("@sentry/types").Integration;
export {};
//# sourceMappingURL=redis.d.ts.map