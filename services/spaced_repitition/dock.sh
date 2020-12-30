docker stop lms-spaced-repitition
docker rm lms-spaced-repitition
docker build -f ./dockerfile -t lms-spaced-repitition .
docker run --name=lms-spaced-repitition --network=lms -p 1000:1000 -d lms-spaced-repitition
