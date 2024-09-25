$(document).ready(function() {
  $('#phone').on('input', function() {
    // Formats phone numbers.
    var value = $(this).val().replace(/\D/g, ''); // Remove all non-digit characters
    var formattedValue = '';
  
    for (var i = 0; i < value.length; i++) {
      if (i > 0 && i % 3 === 0) {
        formattedValue += ' ';
      }
      formattedValue += value[i];
    }
  
    $(this).val(formattedValue);
  });
});