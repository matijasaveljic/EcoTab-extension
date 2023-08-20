// Function to get the current date and time
function getCurrentTime() {
  return new Date().getTime();
}

// Function to change the background image
function changeBackground() {
  const images = [
    "images/background-1.webp",
    "images/background-2.webp",
    "images/background-3.webp",
    "images/background-4.webp",
    "images/background-5.webp",
    "images/background-6.webp",
    "images/background-7.webp",
    "images/background-8.webp",
    "images/background-9.webp",
    "images/background-10.webp",
    // Add more image paths as needed
  ];

  const currentDay = new Date().getDay();
  const imageIndex = currentDay % images.length;
  const selectedImage = images[imageIndex];

  document.body.style.backgroundImage = `url('${selectedImage}')`;
}

// Function to update the background image every 24 hours
function updateBackground() {
  changeBackground();
  setInterval(changeBackground, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
}

// Function to change the text content
const textOptions = [
  "Bees are vital pollinators and are responsible for pollinating approximately one-third of the food we eat.",
  "The Amazon Rainforest produces 20% of the world’s oxygen, earning it the nickname “the lungs of the Earth.”",
  "More text 1",
  "More text 2",
  "More text 3",
  "More text 4",
  // Add more text options here
];

let currentIndex = 0;

function changeText() {
  const textElement = document.getElementById("quote-container");
  currentIndex = (currentIndex + 1) % textOptions.length;
  textElement.innerText = textOptions[currentIndex];
}

function getWeatherData(lat, long) {
  const apiKey = "3fdd32192eaec8df22b1b31415262a53";

  // Make a request to the API
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      // Process the data and update the DOM
      const cityName = data.name;
      const countryName = data.sys.country;
      const temperature = data.main.temp.toFixed(1); // Display temperature with one decimal place

      // Update the weather container with city name, country name, and temperature
      const weatherContainer = document.getElementById("weather-container");
      weatherContainer.innerHTML = `
        <span id="temperature">${temperature}°C</span>
        <span id="city-name">${cityName}, ${countryName}</span>
      `;
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

// Function to toggle the weather container visibility
function toggleWeatherContainer() {
  const weatherContainer = document.getElementById("weather-container");
  const topRightButton = document.getElementById("top-right-button");

  if (weatherContainer.style.display === "none") {
    weatherContainer.style.display = "block";
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log("Latitude:", latitude);
          console.log("Longitude:", longitude);
          getWeatherData(latitude, longitude);

          // Fetch weather data and update the weather container
        },
        (error) => {
          console.error("Error getting user's location:", error);
          weatherContainer.style.display = "none";
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      weatherContainer.style.display = "none";
    }

    topRightButton.innerHTML =
      '<button id="eye-1"><img src="images/eye-1.png" alt="eye" />'; // Use the image for "Show Weather"
  } else {
    weatherContainer.style.display = "none";
    topRightButton.innerHTML =
      '<button id="top-right-button"><img src="images/eye-open-1.png" alt="eye" />'; // Use the image for "Show Weather"
  }
}

// Attach the event listener to the top-right button
const weatherContainer = document.getElementById("weather-container");
weatherContainer.style.display = "none";
const topRightButton = document.getElementById("top-right-button");
topRightButton.addEventListener("click", toggleWeatherContainer);

// Function to update the weather data every 30 minutes
setInterval(getWeatherData, 30 * 60 * 1000); // 30 minutes in milliseconds

// Call the function to update the background and text every 24 hours
updateBackground();

//calendar button

const calendarButton = document.getElementById("calendarButton");
const calendarPopup = document.getElementById("calendarPopup");
const calendarTitle = document.getElementById("calendarTitle");
const calendar = document.getElementById("calendar");

let currentYear, currentMonth, daysInMonth;

calendarButton.addEventListener("click", () => {
  if (calendarPopup.style.display === "none") {
    calendarPopup.style.display = "block";
    initializeCalendar();
  } else {
    calendarPopup.style.display = "none";
  }
});

function initializeCalendar() {
  const currentDate = new Date();
  currentYear = currentDate.getFullYear();
  currentMonth = currentDate.getMonth();

  updateCalendar(currentYear, currentMonth);
}

function updateCalendar(year, month) {
  calendarTitle.textContent = `${getMonthName(month)} ${year}`;

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

  daysInMonth = new Date(year, month + 1, 0).getDate();

  const numDaysInCalendar = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;

  const weekdayRow = document.createElement("div");
  weekdayRow.classList.add("weekday-row");

  for (let i = 0; i < 7; i++) {
    const weekdayElement = document.createElement("div");
    weekdayElement.classList.add("weekday");
    weekdayElement.textContent = weekdays[i];
    weekdayRow.appendChild(weekdayElement);
  }

  calendar.innerHTML = "";
  calendar.appendChild(weekdayRow);

  let dayCounter = 1;

  for (let i = 0; i < numDaysInCalendar / 7; i++) {
    const row = document.createElement("div");
    row.classList.add("calendar-row");

    for (let j = 0; j < 7; j++) {
      const dayElement = document.createElement("div");
      dayElement.classList.add("calendar-day");

      if ((i === 0 && j < firstDayOfWeek) || dayCounter > daysInMonth) {
        dayElement.classList.add("empty-day");
      } else {
        dayElement.textContent = dayCounter;
        dayCounter++;

        // Check if the dayElement represents the current date and add the highlight class
        const currentDate = new Date();
        if (
          year === currentDate.getFullYear() &&
          month === currentDate.getMonth() &&
          parseInt(dayElement.textContent) === currentDate.getDate()
        ) {
          dayElement.classList.add("current-day");
        }
      }

      row.appendChild(dayElement);
    }

    calendar.appendChild(row);
  }
}

function getMonthName(month) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return monthNames[month];
}

function navigateToPreviousMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  updateCalendar(currentYear, currentMonth);
}

function navigateToNextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  updateCalendar(currentYear, currentMonth);
}

const arrowContainerLeft = document.createElement("div");
arrowContainerLeft.classList.add("arrow-container", "arrow-container-left");

const arrowLeft = document.createElement("span");
arrowLeft.classList.add("arrow", "arrow-left");
arrowLeft.innerHTML =
  '<img src="images/arrow-back-new.png" alt="Arrow Left" />';
arrowLeft.addEventListener("click", navigateToPreviousMonth);
arrowContainerLeft.appendChild(arrowLeft);

calendarPopup.insertBefore(arrowContainerLeft, calendarPopup.firstChild);

const arrowContainerRight = document.createElement("div");
arrowContainerRight.classList.add("arrow-container", "arrow-container-right");

const arrowRight = document.createElement("span");
arrowRight.classList.add("arrow", "arrow-right");
arrowRight.innerHTML =
  '<img src="images/arrow-forward-new.png" alt="Arrow Right" />';
arrowRight.addEventListener("click", navigateToNextMonth);
arrowContainerRight.appendChild(arrowRight);

calendarPopup.insertBefore(arrowContainerRight, calendarPopup.firstChild);
calendarPopup.style.display = "none"; //da bi dugne za calendar radilo na prvom kliku

// dugme challenge

const challengeButton = document.getElementById("challengeButton");
const challengePopup = document.getElementById("challengePopup");
const challengeList = document.getElementById("challengeList");

challengeButton.addEventListener("click", () => {
  if (challengePopup.classList.contains("active")) {
    challengePopup.classList.remove("active");
    const openPopups = document.querySelectorAll(".popup-2.active");
    openPopups.forEach((popup) => {
      popup.classList.remove("active");
    });
  } else {
    challengePopup.classList.add("active");
  }
});

//popup-2 prikazivanje

function toggleChallengePopup(challengeNumber) {
  const challengePopup = document.getElementById(
    `challengePopup-${challengeNumber}`
  );
  challengePopup.classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", function () {
  const allBackButtons = document.querySelectorAll(".back-dugme");

  allBackButtons.forEach(function (backButton) {
    backButton.addEventListener("click", function () {
      const popup = this.closest(".popup-2");
      popup.classList.remove("active");
    });
  });
});

// Handle challenge length input
const challengeLengthInputs = document.querySelectorAll(".challenge-text");

challengeLengthInputs.forEach(function (input) {
  input.addEventListener("input", function () {
    const enteredValue = parseInt(this.value);
    if (isNaN(enteredValue)) {
      this.value = "";
    } else {
      this.value = Math.min(31, Math.max(1, enteredValue)); // Enforce the range
    }
  });
});

function setupChallengeInput(inputId, containerId) {
  const input = document.getElementById(inputId);
  const buttonsContainer = document.getElementById(containerId);

  input.addEventListener("input", () => {
    buttonsContainer.innerHTML = ""; // Clear existing buttons

    const challengeLength = parseInt(input.value);
    const limitedChallengeLength = Math.min(31, Math.max(1, challengeLength));

    for (let i = 1; i <= limitedChallengeLength; i++) {
      const button = document.createElement("button");
      button.classList.add("square-button");
      button.textContent = i.toString().padStart(2, "0"); // Ensure two digits
      buttonsContainer.appendChild(button);
    }

    const squareButtons = buttonsContainer.querySelectorAll(".square-button");
    squareButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (button.classList.contains("clicked")) {
          button.classList.remove("clicked");
        } else {
          button.classList.add("clicked");
        }
      });
    });
  });
}

// Set up each challenge input by calling the setupChallengeInput function
setupChallengeInput("userInput1", "buttons-container1");
setupChallengeInput("userInput2", "buttons-container2");
setupChallengeInput("userInput3", "buttons-container3");
setupChallengeInput("userInput4", "buttons-container4");
setupChallengeInput("userInput5", "buttons-container5");
setupChallengeInput("userInput6", "buttons-container6");
setupChallengeInput("userInput7", "buttons-container7");
setupChallengeInput("userInput8", "buttons-container8");
setupChallengeInput("userInput9", "buttons-container9");
setupChallengeInput("userInput10", "buttons-container10");
