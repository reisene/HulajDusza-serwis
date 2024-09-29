/**
 * @description Formats phone input in a real-time manner. It removes non-digit
 * characters, and when the length is exactly 9, it rearranges the digits to display
 * them in groups of three with spaces between each group.
 */
function phoneFormatter() {
  // Formats phone input.
  $('#phone').on('input', function phoneInput() {
    // Formats phone numbers.
    var value = $(this).val().replace(/\D/g, ''); // Remove all non-digit characters
    if (value.length === 9) {
      var formattedValue = '';
      for (var i = 0; i < value.length; i++) {
        if (i > 0 && i % 3 === 0) {
          formattedValue += ' ';
        }
        formattedValue += value[i];
      }
      $(this).val(formattedValue);
    }
  });
};

export default phoneFormatter;