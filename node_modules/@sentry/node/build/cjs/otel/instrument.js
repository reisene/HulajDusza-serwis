Object.defineProperty(exports, '__esModule', { value: true });

const opentelemetry = require('@sentry/opentelemetry');

const INSTRUMENTED = {};

/**
 * Instrument an OpenTelemetry instrumentation once.
 * This will skip running instrumentation again if it was already instrumented.
 */
function generateInstrumentOnce(
  name,
  creator,
) {
  return Object.assign(
    (options) => {
      const instrumented = INSTRUMENTED[name];
      if (instrumented) {
        // If options are provided, ensure we update them
        if (options) {
          instrumented.setConfig(options);
        }
        return;
      }

      const instrumentation = creator(options);
      INSTRUMENTED[name] = instrumentation;

      opentelemetry.addOpenTelemetryInstrumentation(instrumentation);
    },
    { id: name },
  );
}

exports.generateInstrumentOnce = generateInstrumentOnce;
//# sourceMappingURL=instrument.js.map
