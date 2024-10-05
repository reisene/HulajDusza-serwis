import displayNotification from"./modules/notification.js";import phoneFormatter from"./modules/phone_format.js";import initButtonAnimation from"./modules/button-animation.js";phoneFormatter();let{animateButton,resetButton}=initButtonAnimation(),form=document.getElementById("my-form");async function handleSubmit(e,t){if(e.preventDefault(),form){document.getElementById("notification"),document.getElementById("notification-message");e={email:document.getElementById("email").value,phone:document.getElementById("phone").value.replace(/\D/g,""),name:document.getElementById("name").value,message:document.getElementById("message").value};if(e.email||e.phone)if(e.email&&!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.email))displayNotification("Proszę podać prawidłowy adres email.","error");else if(e.phone&&!/^[0-9]{9}$/.test(e.phone))displayNotification("Proszę podać prawidłowy numer telefonu (9 cyfr).","error");else{var o=form.querySelector('button[type="submit"]'),a=(o&&(o.disabled=!0),""+Date.now()+Math.floor(1e6*Math.random()).toString(36)),i=new FormData;i.append("name",e.name),i.append("email",e.email),i.append("phone",e.phone),i.append("message",e.message),i.append("g-recaptcha-response",t),i.append("uniqueID",a);try{var n=await(await fetch("/php/send_email.php",{method:"POST",body:i})).json();n.success?(displayNotification(n.message,"success"),setTimeout(()=>{animateButton("success")},0),setTimeout(()=>{form.reset()},5e3)):(displayNotification(n.message,"error"),setTimeout(()=>{animateButton("error")},0))}catch(e){console.error("Form submission error:",e.message,e.stack),displayNotification("Ups! Wystąpił problem z przesłaniem formularza","error")}finally{o.disabled=!1,setTimeout(()=>{resetButton()},5e3)}}else displayNotification("Proszę podać adres email lub numer telefonu.","error")}else console.error("Form not found.")}form.addEventListener("submit",function(t){t.preventDefault(),grecaptcha.ready(function(){grecaptcha.execute("6LeTFCAqAAAAAKlvDJZjZnVCdtD76hc3YZiIUs_Q",{action:"submit"}).then(function(e){e?handleSubmit(t,e):displayNotification("ReCAPTCHA verification failed. Please try again.","error")}).catch(function(e){console.error("ReCAPTCHA error:",e),displayNotification("ReCAPTCHA verification failed. Please try again.","error")})})});