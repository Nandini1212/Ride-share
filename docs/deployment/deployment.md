# Deployment Strategy

1. Create an EC2 instance.
2. SSH to EC2 instance.
3. Create a directory /var/www/<PROJECT_NAME>.
4. Copy code to EC2 instance at location /var/www/<PROJECT_NAME>.
5. Run the application as a process.
6. Install nginx.
7. Create an nginx config to point to application process.
8. Create route53 entry to point to server.
