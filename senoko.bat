docker rm senoko-admin
docker image prune
docker build -t senoko-admin .
docker images
docker stop senoko-admin-panel
docker container prune
docker run --name "senoko-admin-panel" -d -p 4000:80 senoko-admin
docker ps
curl localhost:4000
