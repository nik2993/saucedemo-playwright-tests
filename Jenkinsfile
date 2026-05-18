pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}/ms-playwright"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/nik2993/saucedemo-playwright-tests.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                sh 'npx playwright install chromium --with-deps'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                sh 'npx playwright test --reporter=line,allure-playwright'
            }
        }
    }

    post {
        always {
            allure([
                results: [[path: 'allure-results']]
            ])
            archiveArtifacts artifacts: 'allure-results/**', allowEmptyArchive: true
        }
        success {
            echo 'All tests passed!'
        }
        failure {
            echo 'Some tests failed. Check the Allure Report.'
        }
    }
}
