pipeline {
    agent any

    environment {
        APP_NAME = "laravel-layananumum"
        BUILDER_IMAGE = "layananumum-builder"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Builder Image') {
            steps {
                sh '''
                docker build -f Dockerfile.builder -t $BUILDER_IMAGE .
                '''
            }
        }

        stage('Install Dependencies & Build Assets') {
            steps {
                sh '''
                docker run --rm \
                  -v $WORKSPACE:/app \
                  $BUILDER_IMAGE \
                  sh -c "composer install --no-dev --optimize-autoloader && npm install && npm run build"
                '''
            }
        }

        stage('Deploy Containers') {
            steps {
                sh '''
                docker-compose down
                docker-compose up -d --build
                '''
            }
        }
    }

    post {
        success {
            echo "✅ DEPLOY SUCCESS"
        }
        failure {
            echo "❌ DEPLOY FAILED"
        }
    }
}
