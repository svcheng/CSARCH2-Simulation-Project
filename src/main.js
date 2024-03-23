// Import packages
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import App from './App.vue'
import router from './router'

// Import stylesheets
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import './assets/main.css'


// Build the app
const app = createApp(App)

app.use(router)
app.use(
    createVuetify({
        icons: {
            defaultSet: 'mdi',
            aliases,
            sets: {
                mdi
            }
        }
    })
)

app.mount('#app')