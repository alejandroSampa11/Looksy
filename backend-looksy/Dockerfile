FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV MONGO_URI=mongodb+srv://alejandrorruizguerrero:MEC7rInd40DEkVh9@marua.9tz3agx.mongodb.net/?retryWrites=true&w=majority&appName=Marua
ENV JWT_SECRET=PIPOELAMORDEMIVIDA

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "src/server.js"]