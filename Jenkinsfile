pipeline {
  agent any
  tools {
    maven 'Maven_HOME'
  }

  stages {
    
    stage('Checkout Application Git Branch') {
        steps {
            git url: 'https://github.com/MineOps-G2/MineOps-WebPage.git',
                branch: 'main'
        }
        post {
                failure {
                  echo 'Repository clone failure !'
                }
                success {
                  echo 'Repository clone success !'
                }
        }
    }
    
    stage('Docker Image Build') {
        steps {
            sh 'pwd'
            sh 'echo ${ENV} > .env'
            sh 'ls'
            sh "docker build . -t chogudwns/mineops:{currentBuild.number}"
        }
        post {
                failure {
                  echo 'Docker image build failure !'
                }
                success {
                  echo 'Docker image build success !'
                }
        }
    }
  }
}
