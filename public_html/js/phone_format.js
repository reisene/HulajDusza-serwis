document.addEventListener("DOMContentLoaded", function() {
    var phoneInput = document.getElementById("phone");

    phoneInput.addEventListener("input", function(event) {
        var value = phoneInput.value.replace(/\D/g, ''); // Remove all non-digit characters
        var formattedValue = '';

        for (var i = 0; i < value.length; i++) {
            if (i > 0 && i % 3 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }

        phoneInput.value = formattedValue;
        phoneInput.setSelectionRange(formattedValue.length, formattedValue.length); // Maintain cursor position
    });
});
