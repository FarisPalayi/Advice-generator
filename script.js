const adviceElm = document.querySelector("[data-advice]");
const adviceIdElm = document.querySelector("[data-advice-id]");
const adviceBtnElm = document.querySelector("[data-advice-generate-btn]");

const loaderElm = document.querySelector("[data-loader]");
const loaderMsgElm = document.querySelector("[data-loader-msg]");

const errorSnackbarElm = document.querySelector("[data-error-snackbar]");
const errorSnackbarMsgElm = document.querySelector("[data-error-snackbar-msg]");
const errorRetryBtnElm = document.querySelector("[data-error-retry-btn]");

/** To run a function after a specified time delay */
function sleep(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function getRandomAdvice() {
  const res = await fetch("https://api.adviceslip.com/advice", { cache: "no-cache"});
  const randomAdvice = await res.json();
  return randomAdvice;
}

function showRandomAdvice(initialCb, successCb, errorCb) { // cb = callback
  initialCb();

  getRandomAdvice()
    .then((data) => { // data validation is omitted for now
      adviceElm.innerText = `“${data.slip.advice}”`;
      adviceIdElm.innerText = `Advice #${data.slip.id}`;
      successCb();
    })
    .catch((err) => {
      console.error(err);
      errorCb();
    });
}

function showLoader() {
  loaderElm.style.display = "block";
  loaderMsgElm.innerText = "Loading advice..."; // for `aria-live` to work
  adviceElm.classList.add("sr-only"); // not using `display: none`, cuz,
  adviceIdElm.classList.add("sr-only"); // it will mess up the screen reader's ability to read the text
}

function hideLoader() {
  loaderElm.style.display = "none";
  loaderMsgElm.innerText = "";
  adviceElm.classList.remove("sr-only");
  adviceIdElm.classList.remove("sr-only");
}

function showSnackbar() {
  errorSnackbarElm.style.opacity = "1";
  errorSnackbarMsgElm.innerText = "An error occurred. Please try again.";
  errorRetryBtnElm.style.display = "inline-block";
  errorRetryBtnElm.focus();

  const hideSnackbarDelay = 5000; // in milliseconds
  sleep(hideSnackbarDelay).then(hideSnackbar);
}

function hideSnackbar() {
  errorSnackbarElm.style.opacity = "0";
  errorRetryBtnElm.style.display = "none";
  errorSnackbarMsgElm.innerText = "";
}

function showRandomAdviceFuncWrapper() {
  showRandomAdvice(
    () => {
      showLoader();
      hideSnackbar();
    },
    () => {
      hideLoader();
      hideSnackbar();
    },
    () => {
      hideLoader();
      showSnackbar();
    }
  );
}

showRandomAdviceFuncWrapper();

adviceBtnElm.addEventListener("click", showRandomAdviceFuncWrapper);

errorRetryBtnElm.addEventListener("click", showRandomAdviceFuncWrapper);
