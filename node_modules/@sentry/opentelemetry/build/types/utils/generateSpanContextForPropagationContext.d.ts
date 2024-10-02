import type { SpanContext } from '@opentelemetry/api';
import type { PropagationContext } from '@sentry/types';
/**
 * Generates a SpanContext that represents a PropagationContext.
 * This can be set on a `context` to make this a (virtual) active span.
 */
export declare function generateSpanContextForPropagationContext(propagationContext: PropagationContext): SpanContext;
//# sourceMappingURL=generateSpanContextForPropagationContext.d.ts.map