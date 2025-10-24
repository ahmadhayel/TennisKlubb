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

// Hämta och visa nyheter med fullt innehåll
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

    // Sortera filer efter datum (nyast först)
    const sortedFiles = files
      .filter((file) => file.name.endsWith(".json"))
      .sort((a, b) => new Date(b.name) - new Date(a.name));

    // Hämta varje nyhetsfil
    for (const file of sortedFiles.slice(0, 6)) {
      // Visa max 6 nyheter
      const newsResponse = await fetch(file.download_url);
      const newsItem = await newsResponse.json();

      // Konvertera markdown till HTML (enkel version)
      const contentHTML = convertMarkdown(newsItem.body);

      // Kortare version för "Läs mer"
      const shortContent =
        contentHTML.length > 150
          ? contentHTML.substring(0, 150) + "..."
          : contentHTML;

      newsHTML += `
                <div class="news-card">
                    <div class="news-date">${new Date(
                      newsItem.date
                    ).toLocaleDateString("sv-SE")}</div>
                    <h3>${newsItem.title}</h3>
                    <div class="news-description">
                        <p><strong>${newsItem.description}</strong></p>
                    </div>
                    <div class="news-content">
                        ${shortContent}
                        ${
                          contentHTML.length > 150
                            ? `<button class="read-more" onclick="showFullContent(this)">Läs mer</button>
                             <div class="full-content" style="display: none;">
                                ${contentHTML}
                                <button class="read-less" onclick="showLessContent(this)" style="margin-top: 1rem;">Visa mindre</button>
                             </div>`
                            : ""
                        }
                    </div>
                </div>
            `;
    }

    newsHTML += "</div>";
    newsContainer.innerHTML = newsHTML;
  } catch (error) {
    console.error("Error loading news:", error);
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

// Enkel markdown till HTML konvertering
function convertMarkdown(markdown) {
  if (!markdown) return "";

  return (
    markdown
      // Radbrytningar till <br>
      .replace(/\n/g, "<br>")
      // **bold** till <strong>
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // *italic* till <em>
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Länkar [text](url)
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
  );
}

// Visa hela innehållet
function showFullContent(button) {
  const fullContent = button.nextElementSibling;
  const newsContent = button.parentElement;

  fullContent.style.display = "block";
  button.style.display = "none";
  newsContent.classList.add("expanded");
}

// Visa mindre innehåll
function showLessContent(button) {
  const fullContent = button.parentElement;
  const newsContent = fullContent.parentElement;
  const readMoreButton = newsContent.querySelector(".read-more");

  fullContent.style.display = "none";
  readMoreButton.style.display = "block";
  newsContent.classList.remove("expanded");
}

// Ladda nyheter när sidan laddas
document.addEventListener("DOMContentLoaded", loadNews);
