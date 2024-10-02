Object.defineProperty(exports, '__esModule', { value: true });

const instrumentationGraphql = require('@opentelemetry/instrumentation-graphql');
const core = require('@sentry/core');
const opentelemetry = require('@sentry/opentelemetry');
const instrument = require('../../otel/instrument.js');
const addOriginToSpan = require('../../utils/addOriginToSpan.js');

const INTEGRATION_NAME = 'Graphql';

const instrumentGraphql = instrument.generateInstrumentOnce(
  INTEGRATION_NAME,
  (_options = {}) => {
    const options = {
      ignoreResolveSpans: true,
      ignoreTrivialResolveSpans: true,
      useOperationNameForRootSpan: true,
      ..._options,
    };

    return new instrumentationGraphql.GraphQLInstrumentation({
      ...options,
      responseHook(span) {
        addOriginToSpan.addOriginToSpan(span, 'auto.graphql.otel.graphql');

        const attributes = core.spanToJSON(span).data || {};

        // If operation.name is not set, we fall back to use operation.type only
        const operationType = attributes['graphql.operation.type'];
        const operationName = attributes['graphql.operation.name'];

        if (options.useOperationNameForRootSpan && operationType) {
          const rootSpan = core.getRootSpan(span);

          // We guard to only do this on http.server spans

          const rootSpanAttributes = core.spanToJSON(rootSpan).data || {};

          const existingOperations = rootSpanAttributes[opentelemetry.SEMANTIC_ATTRIBUTE_SENTRY_GRAPHQL_OPERATION] || [];

          const newOperation = operationName ? `${operationType} ${operationName}` : `${operationType}`;

          // We keep track of each operation on the root span
          // This can either be a string, or an array of strings (if there are multiple operations)
          if (Array.isArray(existingOperations)) {
            existingOperations.push(newOperation);
            rootSpan.setAttribute(opentelemetry.SEMANTIC_ATTRIBUTE_SENTRY_GRAPHQL_OPERATION, existingOperations);
          } else if (existingOperations) {
            rootSpan.setAttribute(opentelemetry.SEMANTIC_ATTRIBUTE_SENTRY_GRAPHQL_OPERATION, [existingOperations, newOperation]);
          } else {
            rootSpan.setAttribute(opentelemetry.SEMANTIC_ATTRIBUTE_SENTRY_GRAPHQL_OPERATION, newOperation);
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
const graphqlIntegration = core.defineIntegration(_graphqlIntegration);

exports.graphqlIntegration = graphqlIntegration;
exports.instrumentGraphql = instrumentGraphql;
//# sourceMappingURL=graphql.js.map
