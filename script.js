const adviceElm = document.querySelector("[data-advice]");
const adviceIdElm = document.querySelector("[data-advice-id]");
const adviceBtnElm = document.querySelector("[data-advice-generate-btn]");

const loaderElm = document.querySelector("[data-loader]");
const loaderMsgElm = document.querySelector("[data-loader-msg]");

const errorSnackbarElm = document.querySelector("[data-error-snackbar]");
const errorSnackbarMsgElm = document.querySelector("[data-error-snackbar-msg]");
const errorRetryBtnElm = document.querySelector("[data-error-retry-btn]");

async function getRandomAdvice() {
  const res = await fetch("https://api.adviceslip.com/advice", { cache: "no-cache"});
  const randomAdvice = await res.json();
  return randomAdvice;
}

function showRandomAdvice(initialCb, successCb, errorCb) { // cb = callback
  initialCb();

  getRandomAdvice()
    .then((data) => { // data validation is omitted
      adviceElm.innerText = `“${data.slip.advice}”`;
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
    loaderMsgElm.innerText = "Loading advice..."; // for `aria-live` to work
    adviceElm.classList.add("sr-only"); // not using `display: none`, cuz,
    adviceIdElm.classList.add("sr-only"); // it will mess up the screen reader's ability to read the text
  } else {
    loaderElm.style.display = "none";
    loaderMsgElm.innerText = "";
    adviceElm.classList.remove("sr-only");
    adviceIdElm.classList.remove("sr-only");
  }
}

function showSnackbar() {
  errorSnackbarElm.style.opacity = "1";
  errorSnackbarMsgElm.innerText = "An error occurred. Please try again.";
  errorRetryBtnElm.style.display = "inline-block";
  errorRetryBtnElm.focus();
}

function hideSnackbar() {
  errorSnackbarElm.style.opacity = "0";
  errorRetryBtnElm.style.display = "none";
  errorSnackbarMsgElm.innerText = "";
}

function renderSnackbar(show = true) {
  const hideSnackbarDelay = 8000; // milliseconds

  if (!show) return hideSnackbar();
  showSnackbar();
  setTimeout(hideSnackbar, hideSnackbarDelay);
}

function showRandomAdviceFuncWrapper() {
  showRandomAdvice(
    () => {
      renderLoader();
      renderSnackbar(false);
    },
    () => {
      renderLoader(false);
      renderSnackbar(false);
    },
    () => {
      renderLoader(false);
      renderSnackbar();
    }
  );
}

showRandomAdviceFuncWrapper();

adviceBtnElm.addEventListener("click", showRandomAdviceFuncWrapper);

errorRetryBtnElm.addEventListener("click", showRandomAdviceFuncWrapper);
