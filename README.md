# MineOps Notice Board & Community

### 주소: http://community.mineops.link

### notion : https://hyeongjun-hub.notion.site/mineops-web-community-page-cf22689552864282b96b7e2fa425a186?pvs=4

### 사용 스택

- backend - Express.js
- frontend - pug, scss, js
- db - MongoDB, AWS-S3
- deploy - heroku

---

# Github Webhook
github push 감지 후 jenkins의 파드로 webhook을 보냄

# Jenkins Pipeline
![image](https://github.com/MineOps-G2/MineOps-WebPage/assets/77392219/f8280a13-20ff-4a4f-bc6d-42aa4899a4c4)

1. webhook으로 pipeline 시작
2. docker image build
3. docker image push
4. manifest file 수정 후 git push

# ArgoCD

1. manifest file의 변경을 감지
2. EKS node의 pod 상태와 sync를 맞추기 위해 ECR에서 pull
3. 업데이트된 pod 배포
