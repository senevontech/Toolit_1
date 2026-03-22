# Base image
FROM node:20-bullseye

# Install system dependencies: LibreOffice + Python + Poppler (for pdf2image)
RUN apt-get update && \
    apt-get install -y \
      libreoffice \
      python3 \
      python3-pip \
      poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Python PDF conversion libraries
RUN pip3 install --no-cache-dir \
    pdf2docx \
    pdfplumber \
    openpyxl \
    pdf2image \
    python-pptx

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the API port (Render maps this automatically)
EXPOSE 5000

# Start the application
CMD ["npm", "run", "start:prod"]
