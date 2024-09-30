# Use the official Nginx image as a base
FROM nginx:alpine

# Remove default Nginx index.html file
RUN rm /usr/share/nginx/html/index.html

# Copy static files to the Nginx directory
COPY . /usr/share/nginx/html/

# Expose port 8080
EXPOSE 8080

# Update Nginx config to listen on port 8080
RUN sed -i 's/80/8080/g' /etc/nginx/conf.d/default.conf

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
