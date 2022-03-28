const adviceElm = document.querySelector("[data-advice]");
const adviceIdElm = document.querySelector("[data-advice-id]");
const adviceBtnElm = document.querySelector("[data-advice-generate-btn]");
const loaderElm = document.querySelector("[data-loader]");
const errorSnackbarElm = document.querySelector("[data-error-snackbar]");
const errorRetryBtnElm = document.querySelector("[data-error-retry-btn]");

function showRandomAdvice(initialCb, successCb, errorCb) {// cb = callback
  initialCb();

  fetch("https://api.adviceslip.com/advice", { cache: "no-cache" })
    .then((res) => res.json())
    .then((data) => {
      adviceElm.innerText = data.slip.advice;
      adviceIdElm.innerText = `Advice #${data.slip.id}`;
      successCb();
    })
    .catch((err) => {
      console.error(err);
      errorCb();
    });
}

function renderLoader(show = true) {
  if (show) {
    loaderElm.style.display = "block";
    adviceElm.style.display = "none";
    adviceIdElm.style.display = "none";
  } else {
    loaderElm.style.display = "none";
    adviceElm.style.display = "block";
    adviceIdElm.style.display = "block";
  }
}

function renderErrorSnackbar(show = true) {
  show
    ? (errorSnackbarElm.style.display = "block")
    : (errorSnackbarElm.style.display = "none");
}

function showRandomAdviceHandler() {
  showRandomAdvice(
    renderLoader,
    () => {
      renderLoader(false);
      renderErrorSnackbar(false);
    },
    () => {
      renderLoader(false);
      renderErrorSnackbar();
    }
  );
}

adviceBtnElm.addEventListener("click", showRandomAdviceHandler);

showRandomAdviceHandler();

errorRetryBtnElm.addEventListener("click", showRandomAdviceHandler);