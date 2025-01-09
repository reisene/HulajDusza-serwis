let STATES={SUBMIT:"submit",LOADING:"loading",SUCCESS:"success",ERROR:"error"},ICONS={PAPER_PLANE:".fa-paper-plane",SPINNER:".fa-spinner",CHECK:".fa-check",TIMES:".fa-times"};function showIcon(t,e){t=t.querySelector(e);t&&t.classList.remove("hidden")}function hideIcon(t,e){t=t.querySelector(e);t&&t.classList.add("hidden")}function resetButtonAnimation(t){t.style.animation="none",t.style.animation=""}function handleLoadingState(t){t.classList.remove(STATES.SUBMIT),t.classList.add(STATES.LOADING),hideIcon(t,ICONS.PAPER_PLANE),showIcon(t,ICONS.SPINNER)}function handleStatusState(t,e){e!==STATES.SUCCESS&&e!==STATES.ERROR||(t.classList.add(e),resetButtonAnimation(t),hideIcon(t,ICONS.SPINNER),showIcon(t,e===STATES.SUCCESS?ICONS.CHECK:ICONS.TIMES))}function resetIcons(e){Object.values(ICONS).forEach(t=>hideIcon(e,t));var t=e.querySelector(ICONS.PAPER_PLANE);t&&t.setAttribute("class","svg-inline--fa fa-paper-plane")}function reportButtonError(){Sentry.captureException(new Error("formButton is null"),{extra:{url:window.location.href,referrer:document.referrer,userAgent:navigator.userAgent,formName:"kontakt",formAction:window.location.href,formMethod:"POST"}})}function initButtonAnimation(){let e=document.getElementById("my-form-button");return e?(e.addEventListener("click",()=>handleLoadingState(e)),e.addEventListener("transitionend",()=>{e.classList.contains(STATES.LOADING)&&e.classList.remove(STATES.LOADING)}),{animateButton:t=>handleStatusState(e,t),resetButton:()=>{e.classList.remove(STATES.LOADING,STATES.SUCCESS,STATES.ERROR),e.classList.add(STATES.SUBMIT),resetIcons(e)}}):(reportButtonError(),{animateButton:()=>{},resetButton:()=>{}})}export default initButtonAnimation;
//# sourceMappingURL=button-animation.js.map
