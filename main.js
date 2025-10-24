const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

ScrollReveal().reveal(".header__container h1", {
  ...scrollRevealOption,
});

ScrollReveal().reveal(".offer__image img", {
  ...scrollRevealOption,
  origin: "left",
});
ScrollReveal().reveal(".offer__content .section__subheader", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".offer__content .section__header", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".offer__content .section__description", {
  ...scrollRevealOption,
  delay: 1500,
});
ScrollReveal().reveal(".offer__content h5, .offer__ratings", {
  ...scrollRevealOption,
  delay: 2000,
});
ScrollReveal().reveal(".offer__content .offer__btn", {
  ...scrollRevealOption,
  delay: 2500,
});

ScrollReveal().reveal(".service__card", {
  ...scrollRevealOption,
  interval: 500,
});

const clientImageArr = [
  "/assets/client-1.jpg",
  "/assets/client-2.jpg",
  "/assets/client-3.jpg",
];

const clientImage = document.querySelector(".client__image img");

function updateSwiperImage(eventName, args) {
  if (eventName === "slideChangeTransitionStart") {
    const index = args && args[0].realIndex;
    clientImage.classList.remove("show");
    clientImage.classList.add("hide");
    clientImage.addEventListener(
      "animationend",
      (e) => {
        clientImage.src = clientImageArr[index];
        clientImage.classList.remove("hide");
        clientImage.classList.add("show");
      },
      {
        once: true,
      }
    );
  }
}
// Typing animation med textbyte
document.addEventListener("DOMContentLoaded", function () {
  const textElement = document.getElementById("changing-text");
  const cursor = document.querySelector(".cursor");

  if (!textElement) return;

  const texts = ["Tennis Klubb", "Padel Klubb", "Tennis & Padel Klubb"];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  let deletingSpeed = 50;
  let pauseBetween = 2000;

  function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      // Radera text
      textElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = deletingSpeed;
    } else {
      // Skriv text
      textElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    // Kolla om vi är klara med att skriva
    if (!isDeleting && charIndex === currentText.length) {
      // Pausa innan radering
      typingSpeed = pauseBetween;
      isDeleting = true;
    }
    // Kolla om vi är klara med att radera
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      // Byt till nästa text
      textIndex = (textIndex + 1) % texts.length;
      typingSpeed = 500; // Paus innan nästa text
    }

    setTimeout(type, typingSpeed);
  }

  // Starta animation efter 1 sekund
  setTimeout(type, 1000);
});
const swiper = new Swiper(".swiper", {
  loop: true,

  navigation: {
    nextEl: ".swiper-next",
    prevEl: ".swiper-prev",
  },

  onAny(event, ...args) {
    updateSwiperImage(event, args);
  },
});

const banner = document.querySelector(".banner__wrapper");

Array.from(banner.children).forEach((item) => {
  const duplicateNode = item.cloneNode(true);
  duplicateNode.setAttribute("aria-hidden", true);
  banner.appendChild(duplicateNode);
});

// Fix för Netlify Identity länkar
document.addEventListener("DOMContentLoaded", function () {
  // Hantera recovery tokens med #
  if (window.location.hash && window.location.hash.includes("recovery_token")) {
    const token = window.location.hash.split("recovery_token=")[1];
    window.location.href = `${window.location.pathname}?recovery_token=${token}`;
  }

  // Hantera invite tokens med #
  if (window.location.hash && window.location.hash.includes("invite_token")) {
    const token = window.location.hash.split("invite_token=")[1];
    window.location.href = `${window.location.pathname}?invite_token=${token}`;
  }
});
// Hämta och visa nyheter
function loadNews() {
  // Eftersom nyheterna sparas i GitHub, behöver vi hämta från JSON
  // Just nu måste vi hämta direkt från GitHub RAW
  const newsContainer = document.getElementById("news-container");

  if (!newsContainer) return;

  // Temporär lösning - vi länkar till GitHub mappen
  newsContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <h3>Nyheterna är sparade!</h3>
            <p>Din nyhet har sparats i CMS:et.</p>
            <p>För att se alla nyheter, gå till:</p>
            <a href="https://github.com/ahmadhayel/TennisKlubb/tree/main/content/news" 
               target="_blank" class="btn" style="margin-top: 1rem;">
                Visa alla nyheter på GitHub
            </a>
        </div>
    `;
}

// Ladda nyheter när sidan laddas
document.addEventListener("DOMContentLoaded", loadNews);
// Hämta och visa nyheter
async function loadNews() {
  const newsContainer = document.getElementById("news-container");
  if (!newsContainer) return;

  try {
    // Hämta nyheter från GitHub RAW
    const response = await fetch(
      "https://api.github.com/repos/ahmadhayel/TennisKlubb/contents/data/news"
    );
    const files = await response.json();

    let newsHTML = '<div class="news-grid">';

    // Hämta varje nyhetsfil
    for (const file of files) {
      if (file.name.endsWith(".json")) {
        const newsResponse = await fetch(file.download_url);
        const newsItem = await newsResponse.json();

        newsHTML += `
                    <div class="news-card">
                        <div class="news-date">${new Date(
                          newsItem.date
                        ).toLocaleDateString("sv-SE")}</div>
                        <h3>${newsItem.title}</h3>
                        <div class="news-content">
                            <p>${newsItem.description}</p>
                        </div>
                    </div>
                `;
      }
    }

    newsHTML += "</div>";
    newsContainer.innerHTML = newsHTML;
  } catch (error) {
    newsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p>Inga nyheter att visa just nu.</p>
                <p>Var först med att skriva en nyhet!</p>
                <a href="/admin/" class="btn" style="margin-top: 1rem;">
                    Skriv nyhet
                </a>
            </div>
        `;
  }
}

// Ladda nyheter när sidan laddas
document.addEventListener("DOMContentLoaded", loadNews);
