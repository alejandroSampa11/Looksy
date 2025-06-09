# Etapa de construcción (build)
FROM node:22-alpine AS builder
ENV NODE_ENV=production
WORKDIR /app
COPY . .
RUN npm config set "strict-ssl" false
RUN npm install --production
RUN npm run build

FROM nginx:alpine
RUN ls
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]