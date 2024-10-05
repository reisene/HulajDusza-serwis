let CACHE_NAME="hulajdusza-cache-v1",urlsToCache=["/","/index.html","/about.html","/services.html","/contact.html","/content/cookies.html","/content/pricing.html","/content/privacy.html","/css/style.css","/css/index.css","/css/services.css","/css/about.css","/css/contact.css","/css/pricing.css","/css/privacy.css","/js/script.js","/js/send_email.js","/js/phone_format.js","/js/sharing-buttons.js","/js/counters.js","/icons/favicon-32x32.png","/icons/apple-icon-57x57.png","/img/Logo/HulajDusza_logo.png"],cacheExpirationTime=30;self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(e=>e.addAll(urlsToCache)))}),self.addEventListener("fetch",c=>{c.respondWith((async()=>{var e,t,s=await caches.open(CACHE_NAME),a=await s.match(c.request);return a?(e=a.headers.get("date"),t=new Date,(e=new Date(e)).setDate(e.getDate()+cacheExpirationTime),e<t?(e=await fetch(c.request),await s.put(c.request,e.clone()),e):a):(t=await fetch(c.request),await s.put(c.request,t.clone()),t)})())}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(e=>Promise.all(e.map(e=>{if(e!==CACHE_NAME)return caches.delete(e)}))))}),self.addEventListener("push",e=>{e.data?console.log("Received push data:",e.data.text()):console.log("Received empty push data")}),self.addEventListener("notificationclick",e=>{e.notification.close(),e.waitUntil(clients.matchAll().then(e=>{if(e.openWindow)return e.openWindow("/")}))});