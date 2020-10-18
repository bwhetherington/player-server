IMAGE_NAME='bwhetherington/player-server'
CONTAINER_NAME='player-server'

docker build -t $IMAGE_NAME .
docker kill $CONTAINER_NAME
docker rm $CONTAINER_NAME
docker run -p 3030:3030 \
  --restart unless-stopped -d \
  --name $CONTAINER_NAME \
  -e MONGODB_USERNAME=$MONGODB_USERNAME \
  -e MONGODB_PASSWORD=$MONGODB_PASSWORD \
  $IMAGE_NAME