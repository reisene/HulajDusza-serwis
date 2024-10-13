function phoneFormatter(){let e=document.getElementById("phone");e.addEventListener("input",()=>{var n=e.value.replace(/\D/g,"");if(3<=n.length){let t="";for(let e=0;e<n.length;e++)0<e&&e%3==0&&(t+=" "),t+=n[e];e.value=t}})}export default phoneFormatter;
//# sourceMappingURL=phone-format.js.map
