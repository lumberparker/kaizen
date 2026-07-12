// Contact form validation with inline error messages.
(function () {
  const form = document.querySelector(".contacto__form");
  if (!form) return;

  const status = form.querySelector(".contacto__status");
  const fields = Array.from(
    form.querySelectorAll(".contacto__input, .contacto__textarea")
  );

  const messages = {
    valueMissing: "Este campo es obligatorio.",
    typeMismatch: "Introduce una dirección de correo válida.",
    patternMismatch: "Introduce un número de teléfono válido.",
    tooShort: "El texto es demasiado corto.",
  };

  const getMessage = (field) => {
    const validity = field.validity;
    for (const key of Object.keys(messages)) {
      if (validity[key]) return messages[key];
    }
    return field.validationMessage;
  };

  const showError = (field) => {
    const error = field
      .closest(".contacto__field")
      .querySelector(".contacto__error");
    const invalidClass =
      field.tagName === "TEXTAREA"
        ? "contacto__textarea_invalid"
        : "contacto__input_invalid";

    if (field.validity.valid) {
      field.classList.remove(invalidClass);
      error.textContent = "";
    } else {
      field.classList.add(invalidClass);
      error.textContent = getMessage(field);
    }
  };

  fields.forEach((field) =>
    field.addEventListener("input", () => {
      showError(field);
      status.textContent = "";
    })
  );

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    fields.forEach(showError);

    if (!form.checkValidity()) {
      status.textContent = "Revisa los campos marcados e intenta de nuevo.";
      return;
    }

    // No backend yet: simulate a successful submission.
    status.textContent =
      "¡Gracias por escribirnos! Te contactaremos muy pronto.";
    form.reset();
  });
})();
