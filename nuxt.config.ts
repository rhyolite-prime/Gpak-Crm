import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  vite: { plugins: [tailwindcss()] },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'GPAK CRM',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      script: [
         
        {
        async: true,
        innerHTML: `(function(c,l,a,r,i,t,y){         c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};         t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);     })(window, document, "clarity", "script", "vuni9cj7j6");`,
        type: 'text/javascript',
        },
         
      ]
    }
  },

  runtimeConfig: {
    public: {
        proxyApiBaseURL: "https://gpak-api.rhyoliteprime.com/api/services/app/",
        //proxyApiBaseURL: "http://localhost:5062/api/services/app/",
        proxyApiAuthBaseURL: "https://gpak-api.rhyoliteprime.com/api/",
        //proxyApiAuthBaseURL: "http://localhost:5062/api/",
    }
  },

  imports: {
    dirs: ["services"],
  },

})