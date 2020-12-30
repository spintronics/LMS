docker stop lms-server
docker rm lms-server
docker build -t lms-server .
docker run --name=lms-server --network=lms -p 80:8080 -d lms-server
