pipeline {
  agent any
  tools {
    maven 'M2'
  }

  stages {

    stage('Checkout Application Git Branch') {
        steps {
            git credentialsId: '{Credential ID}',
                url: 'https://github.com/MineOps-G2/MineOps-WebPage.git',
                branch: 'develop'
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
  }
}
