# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy the contents into the container at /app
COPY app /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Define environment variable for the Cloud Function entry point
ENV PORT=8080

# Run daily_devops.py when the container launches
CMD ["python", "get_daily_devops.py"]
