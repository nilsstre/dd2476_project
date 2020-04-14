# dd2476-project
[![Netlify Status](https://api.netlify.com/api/v1/badges/966fffe7-0705-4709-be9c-1d8b88f56c42/deploy-status)](https://app.netlify.com/sites/dazzling-einstein-023074/deploys)

## Requirements
You will need to have the following installed:
  - `docker`
  - `docker-compose`

## Setup
1. Create a docker volume where we will store the elasticsearch data in:
```
docker volume create elasticsearch
```

2. Create a docker network for the services:
```
docker network create elasticsearch
```

3. Start the `elasticsearch` and `kibana` services with:
```
docker-compose up
```

4. Wait a few seconds for Elasticsearch` and Kibana to start and then open
   http://localhost:5601 to open Kibana.

## Indexing
After you've started Elasticsearch and Kibana you will need to index the PDF
files using FScrawler.

1. Place the PDF files in the folders:
   - `.pdf/regleringsbrev/`
   - `.pdf/arsredovisningar/`

2. Start disposable docker containers for indexing by running the following
   commands from the project root:

   - For "årsredovisningar":
```
docker run --rm \
           --interactive \
           --tty \
           --network elasticsearch \
           --volume $(pwd)/indexing/config/arsredovisningar:/root/.fscrawler/project:ro \
           --volume $(pwd)/pdf/arsredovisningar:/runtime/data:ro \
           nilsx/docker-fscrawler:latest
```

   - For "regleringsbrev":
```
docker run --rm \
           --interactive \
           --tty \
           --network elasticsearch \
           --volume $(pwd)/indexing/config/regleringsbrev:/root/.fscrawler/project:ro \
           --volume $(pwd)/pdf/regleringsbrev:/runtime/data:ro \
           nilsx/docker-fscrawler:latest
```

3. The files should now have been indexed by the Elasticsearch. Open Kibana,
   create an index and have a look.
