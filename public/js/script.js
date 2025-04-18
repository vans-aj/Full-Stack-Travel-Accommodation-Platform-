(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  
    // Add feedback elements for validation
    const titleFeedback = document.createElement('div');
    titleFeedback.innerHTML = `
      <div class="valid-feedback">Looks good!</div>
      <div class="invalid-feedback">Please enter a title.</div>
    `;
    forms.forEach(form => {
      const titleInput = form.querySelector('input[name="title"]');
      if (titleInput) {
        titleInput.parentNode.insertBefore(titleFeedback, titleInput.nextSibling);
      }
    });

    const descriptionFeedback = document.createElement('div');
    descriptionFeedback.innerHTML = `
      <div class="valid-feedback">Looks good!</div>
      <div class="invalid-feedback">Please enter a description.</div>
    `;
    forms.forEach(form => {
      const descriptionInput = form.querySelector('textarea[name="description"]');
      if (descriptionInput) {
        descriptionInput.parentNode.insertBefore(descriptionFeedback, descriptionInput.nextSibling);
      }
    });

    const imageUrlFeedback = document.createElement('div');
    imageUrlFeedback.innerHTML = `
      <div class="valid-feedback">Looks good!</div>
      <div class="invalid-feedback">Please enter a valid image URL.</div>
    `;
    forms.forEach(form => {
      const imageUrlInput = form.querySelector('input[name="imageUrl"]');
      if (imageUrlInput) {
        imageUrlInput.parentNode.insertBefore(imageUrlFeedback, imageUrlInput.nextSibling);
      }
    });

    const priceFeedback = document.createElement('div');
    priceFeedback.innerHTML = `
      <div class="valid-feedback">Looks good!</div>
      <div class="invalid-feedback">Please enter a price.</div>
    `;
    forms.forEach(form => {
      const priceInput = form.querySelector('input[name="price"]');
      if (priceInput) {
        priceInput.parentNode.insertBefore(priceFeedback, priceInput.nextSibling);
      }
    });

    const countryFeedback = document.createElement('div');
    countryFeedback.innerHTML = `
      <div class="valid-feedback">Looks good!</div>
      <div class="invalid-feedback">Please enter a country.</div>
    `;
    forms.forEach(form => {
      const countryInput = form.querySelector('input[name="country"]');
      if (countryInput) {
        countryInput.parentNode.insertBefore(countryFeedback, countryInput.nextSibling);
      }
    });

    const locationFeedback = document.createElement('div');
    locationFeedback.innerHTML = `
      <div class="valid-feedback">Looks good!</div>
      <div class="invalid-feedback">Please enter a location.</div>
    `;
    forms.forEach(form => {
      const locationInput = form.querySelector('input[name="location"]');
      if (locationInput) {
        locationInput.parentNode.insertBefore(locationFeedback, locationInput.nextSibling);
      }
    });
  })();