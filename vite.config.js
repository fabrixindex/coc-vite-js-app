import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  server: {
    proxy: {
      '/api': {
        target: 'https://api.clashofclans.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },

  /*server: {
    proxy: {
      '/api': {
        target: 'https://api.clashofclans.com',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
        
        bypass: function(req, res, proxyOptions) {
          if (req.headers.origin) {
            req.headers.origin = req.headers.origin.replace('https://coc-los-magios-vite-js-app.vercel.app', 'https://cors-anywhere.herokuapp.com');
          }
        }
      },
    },
  },*/

  define: {
    'process.env.TOKEN' : JSON.stringify(process.env.TOKEN),
    'process.env.CLAN': JSON.stringify(process.env.CLAN),
    'process.env.LEAGUEID' : JSON.stringify(process.env.LEAGUEID),
    'process.env.SEASONID' : JSON.stringify(process.env.SEASONID),
    'process.env.ARGENTINALOCATIONID' : JSON.stringify(process.env.ARGENTINALOCATIONID),
    'process.env.MEXICOLOCATIONID' : JSON.stringify(process.env.MEXICOLOCATIONID)
  },
})
