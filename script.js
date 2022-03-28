const adviceElm = document.querySelector("[data-advice]");
const adviceIdElm = document.querySelector("[data-advice-id]");
const adviceBtnElm = document.querySelector("[data-advice-generate-btn]");

let loading = false;

async function showRandomAdvice() {
  if (loading) return;

  runLoader();
  
  await fetch("https://api.adviceslip.com/advice", { cache: "no-cache" })
    .then((res) => res.json())
    .then((data) => {
      adviceElm.innerText = data.slip.advice;
      adviceIdElm.innerText = `Advice #${data.slip.id}`;
      loading = false;
    });
}

adviceBtnElm.addEventListener("click", showRandomAdvice);

showRandomAdvice();


function runLoader() {
  loading = true;
  adviceElm.innerText = "Loading...";
  adviceIdElm.innerText = "";
}

runLoader();
