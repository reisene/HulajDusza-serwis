import type { SeverityLevel } from '@sentry/types';
/**
 * Determine a breadcrumb's log level (only `warning` or `error`) based on an HTTP status code.
 */
export declare function getBreadcrumbLogLevelFromHttpStatusCode(statusCode: number | undefined): SeverityLevel | undefined;
//# sourceMappingURL=breadcrumb-log-level.d.ts.map