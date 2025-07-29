let dots = document.querySelector(".dots");
let body = document.querySelector("body");

body.addEventListener("mousemove", function (dets) {
  gsap.to(dots, {
    x: dets.x,
    y: dets.y,
  });
});

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".search");
  const container = document.getElementById("list-container");

  if (!container || !searchInput) return;

  searchInput.addEventListener("input", function () {
    const query = this.value.trim();

    fetch(`/listing/search/query?q=${searchInput.value}`)
      .then((res) => res.json())
      .then((data) => {
        container.innerHTML = "";

        if (data.length === 0) {
          container.innerHTML =
            '<div class="d-flex justify-content-center align-items-center" style="height: 50vh;">' +
            '<h1 class="text-center">No listings found.</h1>' +
            "</div>";
          return;
        }

        data.forEach((list) => {
          const col = document.createElement("div");
          col.className = "col-sm-6 col-md-6 col-lg-4 mb-4";
          col.innerHTML = `
              <a class="text-decoration-none text-dark" href="/listing/${
                list._id
              }">
                <div class="card h-100 shadow-sm">
                  <img src="${list.image.url}" class="card-img-top" alt="${
            list.title
          }" style="height: 200px; object-fit: cover;">
                  <div class="card-body">
                    <h5 class="card-title">${list.title}</h5>
                    <p class="card-text">&#8377; ${
                      list.price
                        ? Number(list.price).toLocaleString("en-IN")
                        : "N/A"
                    }</p>
                  </div>
                </div>
              </a>
            `;
          container.appendChild(col);
        });
      })
      .catch((err) => {
        console.error("Search failed:", err);
        container.innerHTML =
          "<p class='text-danger'>Error loading results.</p>";
      });
  });
});
