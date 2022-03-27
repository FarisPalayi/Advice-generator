const adviceElm = document.querySelector("[data-advice]");
const adviceIdElm = document.querySelector("[data-advice-id]");
const adviceBtnElm = document.querySelector("[data-advice-generate-btn]");

async function showRandomAdvice() {
  await fetch("https://api.adviceslip.com/advice", { cache: "no-cache" })
    .then((res) => res.json())
    .then((data) => {
      adviceElm.innerText = data.slip.advice;
      adviceIdElm.innerText = `Advice #${data.slip.id}`;
    });
}

adviceBtnElm.addEventListener("click", showRandomAdvice);

showRandomAdvice();
