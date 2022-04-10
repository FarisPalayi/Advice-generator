const qs = (selector, parent = document) => parent.querySelector(selector);

const adviceElm = qs("[data-advice]");
const adviceIdElm = qs("[data-advice-id]");
const adviceBtnElm = qs("[data-advice-generate-btn]");

const loaderElm = qs("[data-loader]");
const loaderMsgElm = qs("[data-loader-msg]");

const errorSnackbarElm = qs("[data-error-snackbar]");
const errorSnackbarMsgElm = qs("[data-error-snackbar-msg]");
const errorRetryBtnElm = qs("[data-error-retry-btn]");

const disableBtn = (btn, disable = true) => (btn.disabled = disable);

disableBtn(adviceBtnElm, false);

const getRandomAdvice = async () => {
  const res = await fetch("https://api.adviceslip.com/advice", {
    cache: "no-cache",
  });
  const randomAdvice = await res.json();
  return randomAdvice;
};

const showLoader = () => {
  loaderElm.style.display = "block";
  loaderMsgElm.innerText = "Loading advice..."; // for `aria-live` to work
  adviceElm.classList.add("sr-only"); // not using `display: none`, cuz,
  adviceIdElm.classList.add("sr-only"); // aria-live won't work (ie. screen reader won't read changing text)
};

const hideLoader = () => {
  loaderElm.style.display = "none";
  loaderMsgElm.innerText = "";
  adviceElm.classList.remove("sr-only");
  adviceIdElm.classList.remove("sr-only");
};

const hideSnackbar = () => {
  errorSnackbarElm.style.transition = "opacity 0s";
  errorSnackbarElm.style.opacity = "0";
  errorRetryBtnElm.style.display = "none";
  errorSnackbarMsgElm.innerText = "";
};

const showSnackbar = (errMsg = "An error occurred. Please try again.") => {
  errorSnackbarElm.style.transition = "opacity 0.2s";
  errorSnackbarElm.style.opacity = "1";
  errorSnackbarMsgElm.innerText = errMsg;
  errorRetryBtnElm.style.display = "inline-block";
  errorRetryBtnElm.focus();
};

const setNewAdviceAnimation = (enable) => {
  const root = document.documentElement;
  adviceElm.classList.toggle("card-advice-anim", enable);
  adviceIdElm.classList.toggle("card-advice-id-anim", enable);
  adviceIdElm.style.setProperty("--txt-animation-order", 0); // to prevent delay
  adviceElm.style.setProperty("--txt-animation-order", 1);
  root.style.setProperty("--txt-anim-interval", "0.28s");
};

const showRandomAdvice = (initialCb, successCb, errorCb) => {
  // cb = callback
  initialCb();

  getRandomAdvice()
    .then((data) => {
      // data validation is omitted for now
      adviceElm.innerText = `“${data.slip.advice}”`;
      adviceIdElm.innerText = `Advice #${data.slip.id}`;
      successCb();
    })
    .catch((err) => {
      console.error(err);
      errorCb();
    });
};

let runAnimation = false; // to prevent anim(setNewAdviceAnimation) from running when page is loaded

const runNewAdviceAnim = (set = true) => {
  if (runAnimation === true) setNewAdviceAnimation(set);
};

const showRandomAdviceWrapper = () =>
  showRandomAdvice(
    () => {
      showLoader();
      hideSnackbar();
      disableBtn(adviceBtnElm);
      runNewAdviceAnim(false);
    },
    () => {
      hideLoader();
      hideSnackbar();
      runNewAdviceAnim();
      disableBtn(adviceBtnElm, false);
      runAnimation = true; // `true` only after fetching the first advice
    },
    () => {
      hideLoader();
      showSnackbar();
      disableBtn(adviceBtnElm, false);
    }
  );

showRandomAdviceWrapper();

adviceBtnElm.addEventListener("click", showRandomAdviceWrapper);

errorRetryBtnElm.addEventListener("click", showRandomAdviceWrapper);
