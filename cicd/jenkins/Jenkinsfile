pipeline {
  agent {
    kubernetes {
      yaml """
kind: Pod
metatdata:
  namespace: jenkins
spec:
  containers:
  - name: kaniko
    image: rohithkakarla/kaniko-alpine:amd64
    env:
    - name: DEST
      value: "087600766519.dkr.ecr.ap-northeast-2.amazonaws.com/web:${currentBuild.number}"
    - name: ENV
      valueFrom:
        secretKeyRef:
          name: webenv
          key: .env  
    imagePullPolicy: Always
    command:
    - /busybox/cat
    tty: true
    volumeMounts:
      - name: docker-config
        mountPath: /kaniko/.docker
  volumes:
    - name: docker-config
      projected:
        sources:
        configMap:
          name: docker-config
"""
    }
  }
  stages {
    stage("Set Variable") {
            steps {
                script {
                    IMAGE_NAME = "web:${currentBuild.number}"
                    SLACK_CHANNEL = "#cicd"
                    SLACK_SUCCESS_COLOR = "#2C953C";
                    SLACK_FAIL_COLOR = "#FF3232";
                    // Git Commit 계정
                    GIT_COMMIT_AUTHOR = sh(script: "git --no-pager show -s --format=%an ${env.GIT_COMMIT}", returnStdout: true).trim();
                    // Git Commit 메시지
                    GIT_COMMIT_MESSAGE = sh(script: "git --no-pager show -s --format=%B ${env.GIT_COMMIT}", returnStdout: true).trim();
                }
            }
            post {
                success {
                    slackSend (
                        channel: SLACK_CHANNEL,
                        color: SLACK_SUCCESS_COLOR,
                        message: "==================================================================\n배포 파이프라인이 시작되었습니다.\n${env.JOB_NAME}(${env.BUILD_NUMBER})\n${GIT_COMMIT_AUTHOR} - ${GIT_COMMIT_MESSAGE}\n${env.BUILD_URL}"
                    )
                }
            }
        }

    stage('Build and Push with Kaniko') {
      steps {
        container(name: 'kaniko', shell: '/busybox/sh') {
          sh '''#!/busybox/sh
            git clone https://github.com/MineOps-G2/MineOps-WebPage.git
            echo "$ENV" > ./MineOps-WebPage/.env
            /kaniko/executor \\
            --git branch=main \\
            --context=dir://./MineOps-WebPage \\
            --destination="${DEST}"
            rm -rf ./MineOps-WebPage
          '''
        }
      }
      post {
            failure {
              slackSend (
                        channel: SLACK_CHANNEL,
                        color: SLACK_FAIL_COLOR,
                        message: "이미지 Build 및 이미지 Push (ECR) 실패\n=================================================================="
                 )
                echo 'Build and Push Failure'
                echo '${currentBuild.result}'
            }
            success {
              slackSend (
                    channel: SLACK_CHANNEL,
                    color: SLACK_SUCCESS_COLOR,
                    message: "이미지 Build 및 이미지 Push (ECR) 성공\n=================================================================="
              )
                echo 'Build and Push Success'
                echo '${currentBuild.result}'
            }
      }
    }
    stage('Update Manifestfile (deployment.yaml)') {
      steps {
        git credentialsId: 'github',
                url: 'https://github.com/MineOps-G2/MineOps-WebPage.git',
                branch: 'main'
        sh "git config --global user.email 'jenkins@jenkins.com'"
        sh "git config --global user.name 'jenkins'"
        sh "sed -i 's/web:.*\$/web:${currentBuild.number}/g' ./cicd/ArgoCD/deployment.yaml"
        sh "git add ./cicd/ArgoCD/deployment.yaml"
        sh "git commit -m 'Update version of web:${currentBuild.number} image'"
        sshagent(credentials: ['bc961ae0-bb48-4b0c-b1ab-40b360478498']) {
                sh "git remote set-url origin git@github.com:MineOps-G2/MineOps-WebPage.git"
                sh "git push -u origin main"
        }
        // sh "git remote add origin https://github.com/MineOps-G2/MineOps-WebPage.git"
        // sh "git push -u origin main"
        // sh "git remote -v"
        // sh "git branch -a"
      }
      post {
            failure {
              slackSend (
                    channel: SLACK_CHANNEL,
                    color: SLACK_SUCCESS_COLOR,
                    message: "이미지 태그 (Deployment.yaml) 업데이트 실패"
              )
                echo 'Update Failure'
            }
            success {
              slackSend (
                    channel: SLACK_CHANNEL,
                    color: SLACK_SUCCESS_COLOR,
                    message: "이미지 태그 (Deployment.yaml) 업데이트 성공"
              )
                echo 'Update Success'
            }
      }
    }
    }
  }
