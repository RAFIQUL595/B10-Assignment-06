// Fetch All Pet Categories
const allPetCategories = async () => {
  try {
    const response = await fetch(
      `https://openapi.programming-hero.com/api/peddy/categories`
    );
    const data = await response.json();
    showPetCategories(data.categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

// Show All Pet Categories
const showPetCategories = (datas) => {
  const container = document.getElementById("categories-container");
  container.innerHTML = "";

  datas.forEach((data) => {
    const div = document.createElement("div");
    div.classList.add(
      "font-bold",
      "border",
      "rounded-xl",
      "p-5",
      "md:px-10",
      "mt-6"
    );
    div.innerHTML = `
        <button onclick="petsByCategory('${data.category}');" class="flex items-center gap-3 pl-12 md:pl-0">
          <img class="w-5 h-5 md:size-8" src="${data.category_icon}" alt="${data.category}">
          ${data.category}
        </button>
      `;
    container.appendChild(div);
  });

  // Handle button clicks
  container.addEventListener("click", function (event) {
    const clickedButton = event.target.closest("button");
    if (clickedButton) {
      const allDivs = container.querySelectorAll("div");
      allDivs.forEach((div) => {
        div.classList.remove("active");
      });

      const clickedDiv = clickedButton.parentElement;
      clickedDiv.classList.add("active");
    }
  });
};

// Fetch Pets by Category
const petsByCategory = async (id) => {
  const loader = document.getElementById("spinner");
  const petsContainer = document.getElementById("pets-container");
  const choosenPet = document.getElementById("div-container");

  loader.classList.remove("hidden");
  choosenPet.classList.add("hidden");
  loader.classList.add("flex");
  petsContainer.style.display = "none";

  try {
    const response = await fetch(
      `https://openapi.programming-hero.com/api/peddy/category/${id}`
    );
    const data = await response.json();

    await new Promise((resolve) => setTimeout(resolve, 2000));

    loader.classList.add("hidden");
    choosenPet.classList.remove("hidden");
    petsContainer.style.display = "grid";

    if (data.data.length === 0) {
      petsContainer.style.display = "block";
      petsContainer.innerHTML = `
       <div class="bg-gray-100 space-y-3 rounded-lg md:[500px] mx-auto lg:[1000px] flex flex-col p-10 items-center justify-items-center">
         <img src="images/error.webp" alt="" />
         <h2 class="text-center font-bold text-xl lg:text-3xl">No Information Available</h2>
         <p class="text-center opacity-70">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
       </div>`;
      return;
    } else {
      displayPets(data.data);
    }
  } catch (error) {
    console.error("Error fetching pets by category:", error);

    loader.style.display = "none";
    petsContainer.style.display = "block";
    petsContainer.innerHTML = `
      <div class="bg-red-100 text-center p-5 rounded-lg">
        <p class="text-red-500">Error fetching data. Please try again later.</p>
      </div>`;
  }
};

// Fetch all pets (default view)
const fetchAllPets = async () => {
  try {
    const response = await fetch(
      "https://openapi.programming-hero.com/api/peddy/pets"
    );
    const data = await response.json();
    displayPets(data.pets);
  } catch (error) {
    console.error("Error fetching pets:", error);
  }
};

// Display pets
const displayPets = (pets) => {
  const container = document.getElementById("pets-container");
  container.innerHTML = "";

  pets.forEach((pet) => {
    const petDiv = document.createElement("div");
    petDiv.classList.add(
      "bg-white",
      "shadow-md",
      "p-4",
      "rounded-md",
      "border",
      "space-y-2"
    );

    // If-else for breed
    let breed = "";
    if (pet.breed) {
      breed = pet.breed;
    } else {
      breed = "Not available";
    }

    // If-else for date of birth
    let birthDate = "";
    if (pet.date_of_birth) {
      birthDate = pet.date_of_birth;
    } else {
      birthDate = "Unknown";
    }

    // If-else for gender
    let gender = "";
    if (pet.gender) {
      gender = pet.gender;
    } else {
      gender = "Unknown";
    }

    // If-else for price
    let price = "";
    if (pet.price) {
      price = `$${pet.price}`;
    } else {
      price = "Not Available";
    }

    petDiv.innerHTML = `
      <img class="rounded-lg" src="${pet.image}" alt="" />
      <h2 class="font-bold text-xl">${pet.pet_name}</h2>
      <p class="text-gray-500"><i class="fa-light fa-grid-2"></i> Breed: ${breed}</p>
      <p class="text-gray-500"><i class="fa-thin fa-calendar"></i> Birth: ${birthDate}</p>
      <p class="text-gray-500"><i class="fa-thin fa-mercury"></i> Gender: ${gender}</p>
      <p class="text-gray-500">$ Price: ${price}</p>
      <hr>
      <div class="flex justify-between gap-1">
        <button onclick="likePets('${pet.image}');" class="border rounded-lg px-2">
          <i class="fa-thin fa-thumbs-up"></i>
        </button>
        <button onclick="adoptPet(this);" class="border rounded-lg px-2 md:text-lg text-[#0E7A81]">Adopt</button>
        <button onclick="fetchPetDetails('${pet.petId}');" class="border rounded-lg px-2 md:text-lg text-[#0E7A81]">Details</button>
      </div>
    `;

    container.appendChild(petDiv);
  });
};

// Show Like Pets (display liked pets)
const likePets = (image) => {
  const showPet = document.getElementById("show-like-pets");
  const likedPetDiv = document.createElement("div");
  likedPetDiv.classList.add("liked-pet");
  likedPetDiv.innerHTML = `
  <img src="${image}" class="lg:w-24 h-24 rounded-lg" />
  `;
  showPet.appendChild(likedPetDiv);
};

// Adopt Pets with Countdown and Modal
const adoptPet = (button) => {
  const modal = document.getElementById("adopt-modal");
  const countdownDisplay = document.getElementById("countdown");

  modal.classList.remove("hidden");

  let countdown = 3;
  countdownDisplay.textContent = countdown;

  // Countdown process
  const countdownInterval = setInterval(() => {
    countdown -= 1;
    countdownDisplay.textContent = countdown;

    if (countdown === 0) {
      clearInterval(countdownInterval);
      button.innerText = "Adopted";
      button.disabled = true;
      modal.classList.add("hidden");
    }
  }, 1000);
};

// Sort pets by price
document.getElementById("sort-btn").addEventListener("click", async () => {
  const response = await fetch(
    "https://openapi.programming-hero.com/api/peddy/pets"
  );
  const data = await response.json();
  const sortedPets = data.pets.sort((a, b) => b.price - a.price);
  displayPets(sortedPets);
});

// ShowDetails Section
function showModal(data) {
  const singlePetData = data.petData;
  const modal = document.getElementById("my_modal_1");

  // If-else for breed
  let breed = "";
  if (singlePetData.breed) {
    breed = singlePetData.breed;
  } else {
    breed = "Not available";
  }

  // If-else for date of birth
  let birthDate = "";
  if (singlePetData.date_of_birth) {
    birthDate = singlePetData.date_of_birth;
  } else {
    birthDate = "Unknown";
  }

  // If-else for gender
  let gender = "";
  if (singlePetData.gender) {
    gender = singlePetData.gender;
  } else {
    gender = "Unknown";
  }

  // If-else for price
  let price = "";
  if (singlePetData.price) {
    price = `$${singlePetData.price}`;
  } else {
    price = "Not Available";
  }

  // If-else for vaccinated status
  let vaccinatedStatus = "";
  if (singlePetData.vaccinated_status) {
    vaccinatedStatus = singlePetData.vaccinated_status;
  } else {
    vaccinatedStatus = "Not Available";
  }

  // If-else for pet details
  let petDetails = "";
  if (singlePetData.pet_details) {
    petDetails = singlePetData.pet_details;
  } else {
    petDetails = "Not Available";
  }

  modal.innerHTML = `
    <div class="modal-box space-y-2">
      <img class="rounded-lg w-full h-60" src="${singlePetData.image}" alt="" />
      <h2 class="font-bold text-2xl">${singlePetData.pet_name}</h2>
      <div class="flex gap-12">
        <p class="text-gray-500"><i class="fa-light fa-grid-2"></i> Breed: ${breed}</p>
        <p class="text-gray-500"><i class="fa-thin fa-calendar"></i> Birth: ${birthDate}</p>
      </div>
      <div class="flex gap-14">
        <p class="text-gray-500"><i class="fa-thin fa-mercury"></i> Gender: ${gender}</p>
        <p class="text-gray-500">$ Price: ${price}</p>
      </div>
      <p class="text-gray-500"><i class="fa-thin fa-syringe"></i> Vaccinated status: ${vaccinatedStatus}</p>
      <hr>
      <h2 class="font-semibold">Details Information</h2>
      <p class="text-gray-500">${petDetails}</p>
      <div class="flex justify-center">
        <form method="dialog">
          <button class="btn">Close</button>
        </form>
      </div>
    </div>
  `;

  // Show the modal
  modal.showModal();
}

// Pet Details by ID
const fetchPetDetails = async (petId) => {
  try {
    const response = await fetch(
      `https://openapi.programming-hero.com/api/peddy/pet/${petId}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const petData = await response.json();
    showModal(petData);
  } catch (error) {
    console.error("Error fetching pet details:", error);
    alert("Failed to fetch pet details. Please try again later.");
  }
};

// categories on page load
fetchAllPets();
allPetCategories();
