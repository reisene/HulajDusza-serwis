import type { MinimalNestJsApp, NestJsErrorFilter } from './types';
export declare const instrumentNest: (() => void) & {
    id: string;
};
/**
 * Nest framework integration
 *
 * Capture tracing data for nest.
 */
export declare const nestIntegration: () => import("@sentry/types").Integration;
/**
 * Setup an error handler for Nest.
 */
export declare function setupNestErrorHandler(app: MinimalNestJsApp, baseFilter: NestJsErrorFilter): void;
//# sourceMappingURL=nest.d.ts.map