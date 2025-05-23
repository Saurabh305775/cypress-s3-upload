FROM cypress/browsers:node-22.14.0-chrome-133.0.6943.126-1-ff-135.0.1-edge-133.0.3065.82-1
RUN addgroup --system cypress && adduser --system --ingroup cypress cypress
USER root
WORKDIR /e2e
COPY package.json package-lock.json ./
RUN npm ci && npx cypress install
COPY . .
RUN npx cypress verify
CMD npx cypress run && node upload-to-s3.js
CMD ["sh", "-c", "npx cypress run && node upload-to-s3.js"]

