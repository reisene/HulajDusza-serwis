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