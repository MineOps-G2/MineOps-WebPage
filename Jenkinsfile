pipeline {
  agent any
  tools {
    maven 'Maven_HOME'
  }
  environment{
    dockerHubRegistry = 'chogudwns/mineops'
    dockerHubRegistryCredential = '615cd191-faec-4277-93ca-04cbaec4a556'
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
            sh 'echo ${ENV} > ./.env'
            sh 'ls -al'
            sh "docker build . -t ${dockerHubRegistry}:${currentBuild.number}"
            sh "docker build . -t ${dockerHubRegistry}:latest"
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
    
    stage('Docker Image Push') {
        steps {
          withDockerRegistry([ credentialsId: dockerHubRegistryCredential, url: "" ]) {
                                sh "docker push ${dockerHubRegistry}:${currentBuild.number}"
                                sh "docker push ${dockerHubRegistry}:latest"

                                sleep 10 /* Wait uploading */ 
                            }
        }
        post {
                failure {
                  echo 'Docker Image Push failure !'
                  sh "docker rmi ${dockerHubRegistry}:${currentBuild.number}"
                  sh "docker rmi ${dockerHubRegistry}:latest"
                }
                success {
                  echo 'Docker image push success !'
                  sh "docker rmi ${dockerHubRegistry}:${currentBuild.number}"
                  sh "docker rmi ${dockerHubRegistry}:latest"
                }
        }
    }
  }
}
