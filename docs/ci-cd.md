# CI/CD Workflow
[![CI/CD Workflow](https://github.com/varunshaji98/investsavvy/actions/workflows/CI-CD-pipeline.yml/badge.svg?branch=main)](https://github.com/varunshaji98/investsavvy/actions/workflows/CI-CD-pipeline.yml)

- [Objective](#objective)
- [JOB 1: docker-build-push](#job-1-docker-build-push)
  - [Containerize into Docker image](#containerize-into-docker-image)
  - [Quick Sanity Test](#quick-sanity-test)
  - [Push to GitHub Container Registry](#push-to-github-container-registry)
- [JOB 2: automated-api-tests](#job-2-automated-api-tests)
  - [Postman Command Line Integration (CLI)](#postman-command-line-integration-cli)
    - [Postman Collection and Environment](#postman-collection-and-environment)
  - [Pull docker image from GitHub Container Registry](#pull-docker-image-from-github-container-registry)
  - [Run the container](#run-the-container)
  - [Install and Run Postman CLI tests](#install-and-run-postman-cli-tests)
- [JOB 3: deploy-backend](#job-3-deploy-backend)


## Objective

```yml
on:
  push:
    branches: [ "main" ]
    paths:
      - backend/**
  pull_request:
    branches: [ "main" ]
    paths:
      - backend/**
```

## JOB 1: docker-build-push

### Containerize into Docker image
Tagged with both latest and timestamp

```yml
docker-build-push:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout 
      uses: actions/checkout@v3
    - name: Build the Docker image
      run: |
        docker build . --file backend/Dockerfile \
          --tag ghcr.io/varunshaji98/investsavvy:$(date +%s) \
          --tag ghcr.io/varunshaji98/investsavvy:latest
```

### Quick Sanity Test
To check

```yml
    - name: Do a quick sanity test on the docker image
      run: |
        docker run -p 3000:3000 \
          -e DB_HOST=${{ secrets.DB_HOST }} \
          -e DB_PORT=${{ secrets.DB_PORT }} \
          -e DB_USER=${{ secrets.DB_USER }} \
          -e DB_PASS=${{ secrets.DB_PASS }} \
          -e DB_NAME=${{ secrets.DB_NAME }} \
          -d ghcr.io/varunshaji98/investsavvy:latest
```

### Push to GitHub Container Registry

```yml
    - name: Login to GitHub Container Registry
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.repository_owner }}
        password: ${{ secrets.PROJECT_GITHUB_TOKEN }}
    - name: Push to Github Container Registry
      run: |
        docker push -a ghcr.io/varunshaji98/investsavvy
```

## JOB 2: automated-api-tests

### Postman Command Line Integration (CLI) 

#### Postman Collection and Environment

### Pull docker image from GitHub Container Registry
```yml
automated-api-tests:
    needs: docker-build-push
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v3
    - name: Login to GitHub Container Registry
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.repository_owner }}
        password: ${{ secrets.PROJECT_GITHUB_TOKEN }}
    - name: Pull latest image from Github Container Registry
      run: docker pull ghcr.io/varunshaji98/investsavvy
```
### Run the container
```yml
    - name: Run the docker container
      run: |
        docker run -p 3000:3000 \
          -e DB_HOST=${{ secrets.DB_HOST }} \
          -e DB_PORT=${{ secrets.DB_PORT }} \
          -e DB_USER=${{ secrets.DB_USER }} \
          -e DB_PASS=${{ secrets.DB_PASS }} \
          -e DB_NAME=${{ secrets.DB_NAME }} \
          -d ghcr.io/varunshaji98/investsavvy
        sleep 5
```

### Install and Run Postman CLI tests

```yml
    - name: Install Postman CLI
      run: |
        curl -o- "https://dl-cli.pstmn.io/install/linux64.sh" | sh
    - name: Login to Postman CLI
      run: postman login --with-api-key ${{ secrets.POSTMAN_API_KEY }}
    - name: Run API tests
      run: |
        docker ps
        postman collection run "33397024-6c70459c-802f-464e-8160-f7053090d68a" \
          -e "33397024-1dbd4062-670f-4bde-b475-04a9a4eb831e"
```

## JOB 3: deploy-backend

Render API Hook to manually deploy commmit  
```yml
deploy-backend:
    needs: [docker-build-push, automated-api-tests]
    runs-on: ubuntu-latest
    steps:
    - name: Deploy
      env:
        deploy_url: ${{ secrets.RENDER_DEPLOY_HOOK_URL }}
      run: |
        curl "$deploy_url"
```
 