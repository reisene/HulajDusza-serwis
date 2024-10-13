function phoneFormatter() {
  // Formats phone input.
  const phoneInput = document.getElementById('phone');

  phoneInput.addEventListener('input', () => {
    // Formats phone numbers as user types.
    const value = phoneInput.value.replace(/\D/g, ''); // Remove all non-digit characters
    if (value.length >= 3) {

      let formattedValue = '';
      for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 3 === 0) {
          formattedValue += ' ';
        }
        formattedValue += value[i];
      }
      phoneInput.value = formattedValue;
    }
  });

}

export default phoneFormatter;