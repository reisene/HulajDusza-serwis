/// <reference types="node" />
import type { ClientRequest, IncomingMessage, RequestOptions, ServerResponse } from 'node:http';
import type { Span } from '@opentelemetry/api';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import type { HTTPModuleRequestIncomingMessage } from '../transports/http-module';
interface HttpOptions {
    /**
     * Whether breadcrumbs should be recorded for requests.
     * Defaults to true
     */
    breadcrumbs?: boolean;
    /**
     * Do not capture spans or breadcrumbs for outgoing HTTP requests to URLs where the given callback returns `true`.
     * This controls both span & breadcrumb creation - spans will be non recording if tracing is disabled.
     *
     * The `url` param contains the entire URL, including query string (if any), protocol, host, etc. of the outgoing request.
     * For example: `'https://someService.com/users/details?id=123'`
     *
     * The `request` param contains the original {@type RequestOptions} object used to make the outgoing request.
     * You can use it to filter on additional properties like method, headers, etc.
     */
    ignoreOutgoingRequests?: (url: string, request: RequestOptions) => boolean;
    /**
     * Do not capture spans or breadcrumbs for incoming HTTP requests to URLs where the given callback returns `true`.
     * This controls both span & breadcrumb creation - spans will be non recording if tracing is disabled.
     *
     * The `urlPath` param consists of the URL path and query string (if any) of the incoming request.
     * For example: `'/users/details?id=123'`
     *
     * The `request` param contains the original {@type IncomingMessage} object of the incoming request.
     * You can use it to filter on additional properties like method, headers, etc.
     */
    ignoreIncomingRequests?: (urlPath: string, request: IncomingMessage) => boolean;
    /**
     * Additional instrumentation options that are passed to the underlying HttpInstrumentation.
     */
    instrumentation?: {
        requestHook?: (span: Span, req: ClientRequest | HTTPModuleRequestIncomingMessage) => void;
        responseHook?: (span: Span, response: HTTPModuleRequestIncomingMessage | ServerResponse) => void;
        applyCustomAttributesOnSpan?: (span: Span, request: ClientRequest | HTTPModuleRequestIncomingMessage, response: HTTPModuleRequestIncomingMessage | ServerResponse) => void;
        /**
         * You can pass any configuration through to the underlying instrumention.
         * Note that there are no semver guarantees for this!
         */
        _experimentalConfig?: ConstructorParameters<typeof HttpInstrumentation>[0];
    };
    /** Allows to pass a custom version of HttpInstrumentation. We use this for Next.js. */
    _instrumentation?: typeof HttpInstrumentation;
}
/**
 * Instrument the HTTP module.
 * This can only be instrumented once! If this called again later, we just update the options.
 */
export declare const instrumentHttp: (() => void) & {
    id: string;
};
/**
 * The http integration instruments Node's internal http and https modules.
 * It creates breadcrumbs and spans for outgoing HTTP requests which will be attached to the currently active span.
 */
export declare const httpIntegration: (options?: HttpOptions | undefined) => import("@sentry/types").Integration;
export {};
//# sourceMappingURL=http.d.ts.map