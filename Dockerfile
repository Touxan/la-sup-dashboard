# Étape 1 : Build de l'application avec Node.js
FROM node:20 AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Étape 2 : Utilisation de Nginx pour servir l'application
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copier le build Vite dans Nginx
COPY --from=builder /app/dist .

# Copier la configuration optimisée de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80 (HTTP)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
