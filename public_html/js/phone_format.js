$(document).ready(function() {
    // Formats phone numbers.
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
  
      var cursorPosition = $(this).caretPosition();
      $(this).val(formattedValue);
      $(this).caretPosition(cursorPosition);
    });
  });
  
  // Helper function to get the current cursor position
  $.fn.caretPosition = function() {
    if (this[0].selectionStart) {
      return this[0].selectionStart;
    } else if (document.selection) {
      this[0].focus();
      var r = document.selection.createRange();
      if (r != null) {
        var re = this[0].createTextRange();
        var rc = re.duplicate();
        re.moveToBookmark(r.getBookmark());
        rc.moveToBookmark(r.getBookmark());
        return rc.moveStart('character', -this[0].value.length);
      }
    }
    return 0;
  };
  
  // Helper function to set the cursor position
  $.fn.caretPosition = function(position) {
    if (this[0].selectionStart) {
      this[0].focus();
      this[0].setSelectionRange(position, position);
    } else if (document.selection) {
      this[0].focus();
      var range = this[0].createTextRange();
      range.moveStart('character', position);
      range.collapse();
      range.select();
    }
  };