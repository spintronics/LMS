# https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app
# gcloud auth configure-docker

APP_NAME=lms-graphite

docker build -t gcr.io/lms-graphite/web .
docker push gcr.io/lms-graphite/web
kubectl create deployment lms-graphite --image=gcr.io/lms-graphite/web
kubectl scale deployment lms-graphite --replicas=1
kubectl autoscale deployment lms-graphite --cpu-percent=80 --min=1 --max=5