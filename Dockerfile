FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Start simple HTTP server
CMD ["python", "-m", "http.server", "8080"]
