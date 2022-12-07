pipeline {
  agent {
    kubernetes {
      yaml """
kind: Pod
metatdata:
  namespace: jenkins
spec:
  containers:
  - name: app
    image: chogudwns/mineops:latest
    env:
    - name: ENV
      valueFrom:
        secretKeyRef:
          name: webenv
          key: .env  
    imagePullPolicy: Always
    tty: true
"""
    }
  }
  
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
            sh "docker build . -t chogudwns"
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
