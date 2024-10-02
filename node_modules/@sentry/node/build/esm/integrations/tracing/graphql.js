import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { defineIntegration, spanToJSON, getRootSpan } from '@sentry/core';
import { SEMANTIC_ATTRIBUTE_SENTRY_GRAPHQL_OPERATION } from '@sentry/opentelemetry';
import { generateInstrumentOnce } from '../../otel/instrument.js';
import { addOriginToSpan } from '../../utils/addOriginToSpan.js';

const INTEGRATION_NAME = 'Graphql';

const instrumentGraphql = generateInstrumentOnce(
  INTEGRATION_NAME,
  (_options = {}) => {
    const options = {
      ignoreResolveSpans: true,
      ignoreTrivialResolveSpans: true,
      useOperationNameForRootSpan: true,
      ..._options,
    };

    return new GraphQLInstrumentation({
      ...options,
      responseHook(span) {
        addOriginToSpan(span, 'auto.graphql.otel.graphql');

        const attributes = spanToJSON(span).data || {};

        // If operation.name is not set, we fall back to use operation.type only
        const operationType = attributes['graphql.operation.type'];
        const operationName = attributes['graphql.operation.name'];

        if (options.useOperationNameForRootSpan && operationType) {
          const rootSpan = getRootSpan(span);

          // We guard to only do this on http.server spans

          const rootSpanAttributes = spanToJSON(rootSpan).data || {};

          const existingOperations = rootSpanAttributes[SEMANTIC_ATTRIBUTE_SENTRY_GRAPHQL_OPERATION] || [];

          const newOperation = operationName ? `${operationType} ${operationName}` : `${operationType}`;

          // We keep track of each operation on the root span
          // This can either be a string, or an array of strings (if there are multiple operations)
          if (Array.isArray(existingOperations)) {
            existingOperations.push(newOperation);
            rootSpan.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_GRAPHQL_OPERATION, existingOperations);
          } else if (existingOperations) {
            rootSpan.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_GRAPHQL_OPERATION, [existingOperations, newOperation]);
          } else {
            rootSpan.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_GRAPHQL_OPERATION, newOperation);
          }
        }
      },
    });
  },
);

const _graphqlIntegration = ((options = {}) => {
  return {
    name: INTEGRATION_NAME,
    setupOnce() {
      instrumentGraphql(options);
    },
  };
}) ;

/**
 * GraphQL integration
 *
 * Capture tracing data for GraphQL.
 */
const graphqlIntegration = defineIntegration(_graphqlIntegration);

export { graphqlIntegration, instrumentGraphql };
//# sourceMappingURL=graphql.js.map
