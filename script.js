const adviceElm = document.querySelector("[data-advice]");
const adviceIdElm = document.querySelector("[data-advice-id]");
const adviceBtnElm = document.querySelector("[data-advice-generate-btn]");

async function showRandomAdvice() {
  try {
    const res = await fetch("https://api.adviceslip.com/advice");
    const data = await res.json();

    adviceElm.innerText = data.slip.advice;
    adviceIdElm.innerText = `Advice #${data.slip.id}`;
  } catch (err) {
    console.error(err);
  }
}

adviceBtnElm.addEventListener("click", showRandomAdvice);

showRandomAdvice();
