"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function phoneFormatter() {
  // Formats phone input.
  var phoneInput = document.getElementById('phone');
  phoneInput.addEventListener('input', function () {
    // Formats phone numbers as user types.
    var value = phoneInput.value.replace(/\D/g, ''); // Remove all non-digit characters
    if (value.length === 9) {
      var formattedValue = '';
      for (var i = 0; i < value.length; i++) {
        if (i > 0 && i % 3 === 0) {
          formattedValue += ' ';
        }
        formattedValue += value[i];
      }
      phoneInput.value = formattedValue;
    }
  });
}
var _default = exports["default"] = phoneFormatter;
//# sourceMappingURL=phone_format.js.map
