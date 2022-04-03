const qs = (selector, parent = document) => parent.querySelector(selector);

const adviceElm = qs("[data-advice]");
const adviceIdElm = qs("[data-advice-id]");
const adviceBtnElm = qs("[data-advice-generate-btn]");

const loaderElm = qs("[data-loader]");
const loaderMsgElm = qs("[data-loader-msg]");

const errorSnackbarElm = qs("[data-error-snackbar]");
const errorSnackbarMsgElm = qs("[data-error-snackbar-msg]");
const errorRetryBtnElm = qs("[data-error-retry-btn]");

adviceBtnElm.disabled = false;

const getRandomAdvice = async () => {
  const res = await fetch("https://api.adviceslip.com/advice", { cache: "no-cache" });
  const randomAdvice = await res.json();
  return randomAdvice;
}

const showLoader = () => {
  loaderElm.style.display = "block";
  loaderMsgElm.innerText = "Loading advice..."; // for `aria-live` to work
  adviceElm.classList.add("sr-only"); // not using `display: none`, cuz,
  adviceIdElm.classList.add("sr-only"); // it will mess up the screen reader's ability to read the text
}

const hideLoader = () => {
  loaderElm.style.display = "none";
  loaderMsgElm.innerText = "";
  adviceElm.classList.remove("sr-only");
  adviceIdElm.classList.remove("sr-only");
}

const hideSnackbar = () => {
  errorSnackbarElm.style.opacity = "0";
  errorRetryBtnElm.style.display = "none";
  errorSnackbarMsgElm.innerText = "";
}

const showSnackbar = (errMsg = "An error occurred. Please try again.") => {
  errorSnackbarElm.style.opacity = "1";
  errorSnackbarMsgElm.innerText = errMsg;
  errorRetryBtnElm.style.display = "inline-block";
  errorRetryBtnElm.focus();
}

const showRandomAdvice = (initialCb, successCb, errorCb) => { // cb = callback
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

const showRandomAdviceWrapper = () =>
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

showRandomAdviceWrapper();

adviceBtnElm.addEventListener("click", showRandomAdviceWrapper);

errorRetryBtnElm.addEventListener("click", showRandomAdviceWrapper);
