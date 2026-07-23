// Jenkins pipeline for langfuse-docs.
//
// Scope: build the production image (Dockerfile.prod), push it to Docker
// Hub, then deploy it to DEPLOY_HOST via SSH + docker compose and verify
// with a health check — mirroring the hypermakinarag-pipeline job's
// Deploy/Health Check pattern on this same Jenkins instance.
//
// Required Jenkins setup (configure once, outside this file):
//   - Plugins: "Docker Pipeline", "Git", "SSH Agent" (provides
//     sshUserPrivateKey for withCredentials).
//   - The Jenkins agent needs Docker CLI + daemon access (it builds/pushes
//     images directly — no Docker-in-Docker is configured here) and network
//     access to DEPLOY_HOST for the SSH deploy step and the health check.
//   - Job parameters DEPLOY_HOST / DEPLOY_DIR (String Parameters) — already
//     configured on this job. DEPLOY_DIR (e.g.
//     /svc/app/langfusedocs.uiscloud.net) did not exist yet on DEPLOY_HOST
//     as of writing; the Deploy stage creates it and has never been proven
//     end-to-end against a real server — verify the first real run closely.
//   - A "Username with password" credential for Docker Hub, ID matching
//     DOCKERHUB_CREDENTIALS_ID below (username + access token, not your
//     account password). Pushes to knowwheresoft/langfuse-docs on Docker Hub.
//   - An "SSH Username with private key" credential named "deploy-server-ssh"
//     (the same one hypermakinarag-pipeline uses) with access to DEPLOY_HOST.
//   - STRONGLY RECOMMENDED, in practice required: a "Secret text" credential
//     named "github-access-token" holding a GitHub PAT (public_repo read
//     access is enough). Verified by actually running this build: without
//     it, the prebuild step's GitHub API calls (stars/contributors/workshop
//     sync) blow through the unauthenticated rate limit almost immediately
//     and scripts/sync-workshop.mjs fails the whole build. The pipeline
//     below tolerates the credential being absent (falls back to an empty
//     token) but the build will then likely fail at the "Docker Build"
//     stage — configure this credential before relying on this pipeline.
//   - Optional: additional credentials for the other NEXT_PUBLIC_* build
//     args if you want real analytics/product keys baked into the image —
//     those integrations degrade gracefully when their key is absent, so
//     this is not required to get a working build. The four
//     *_LANGFUSE_BASE_URL vars already default to Langfuse's real public
//     Cloud region URLs in Dockerfile.prod (required for the build to
//     succeed at all — see comments there) and don't need to be set here
//     unless you want to point at different regions.
//   - No .env file is required on the deploy server: every integration
//     degrades gracefully when its key is absent (see .env.template).
//     Place one at DEPLOY_DIR/.env on the server before deploying if you
//     want real secrets — docker-compose.yml picks it up automatically.

pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: "20"))
  }

  environment {
    IMAGE_NAME = "knowwheresoft/langfuse-docs"
    IMAGE_TAG = "${env.GIT_COMMIT ? env.GIT_COMMIT.take(7) : 'dev'}"
    DOCKERHUB_CREDENTIALS_ID = "dockerhub-credentials"
  }

  stages {
    stage("Checkout") {
      steps {
        // fumadocs-mdx's lastModified() plugin shells out to `git log` per
        // content file, so this checkout must have full history, not a
        // shallow clone.
        checkout([
          $class: "GitSCM",
          branches: scm.branches,
          userRemoteConfigs: scm.userRemoteConfigs,
          extensions: scm.extensions + [
            [$class: "CloneOption", shallow: false, depth: 0, noTags: false]
          ]
        ])
      }
    }

    stage("Lint & Type Check") {
      agent {
        docker {
          image "node:22-slim"
          reuseNode true
        }
      }
      steps {
        sh """
          corepack enable
          corepack prepare pnpm@9.5.0 --activate
          pnpm install --frozen-lockfile
          pnpm run format:check
          npx tsc --noEmit
        """
      }
    }

    stage("Docker Build") {
      steps {
        script {
          // In practice required (see setup notes above) — the build will
          // likely fail without it, but don't hard-fail the pipeline here
          // so the real error surfaces from the build step itself.
          def githubToken = ""
          try {
            withCredentials([string(credentialsId: "github-access-token", variable: "GHTOKEN")]) {
              githubToken = env.GHTOKEN
            }
          } catch (err) {
            echo "WARNING: no 'github-access-token' credential configured — the build will likely fail due to GitHub API rate-limiting. See setup notes at the top of this file."
          }

          dockerImage = docker.build(
            "${IMAGE_NAME}:${IMAGE_TAG}",
            "-f Dockerfile.prod --build-arg GITHUB_ACCESS_TOKEN=${githubToken} ."
          )
        }
      }
    }

    stage("Push to Docker Hub") {
      steps {
        script {
          docker.withRegistry("https://registry.hub.docker.com", DOCKERHUB_CREDENTIALS_ID) {
            dockerImage.push("${IMAGE_TAG}")
            dockerImage.push("latest")
          }
        }
      }
    }

    stage("Deploy") {
      steps {
        withCredentials([
          sshUserPrivateKey(
            credentialsId: "deploy-server-ssh",
            keyFileVariable: "SSH_KEY",
            usernameVariable: "SSH_USER"
          ),
          usernamePassword(
            credentialsId: "dockerhub-credentials",
            usernameVariable: "REG_USER",
            passwordVariable: "REG_PASS"
          )
        ]) {
          sh """
            ssh -i \$SSH_KEY -o StrictHostKeyChecking=no \
              \${SSH_USER}@\${DEPLOY_HOST} "mkdir -p \${DEPLOY_DIR}"

            scp -i \$SSH_KEY -o StrictHostKeyChecking=no \
              docker-compose.yml \${SSH_USER}@\${DEPLOY_HOST}:\${DEPLOY_DIR}/

            ssh -i \$SSH_KEY -o StrictHostKeyChecking=no \
              \${SSH_USER}@\${DEPLOY_HOST} "
                echo \$REG_PASS | docker login -u \$REG_USER --password-stdin
                cd \${DEPLOY_DIR}
                export IMAGE_TAG=${IMAGE_TAG}
                docker compose pull
                docker compose up -d --remove-orphans
                docker logout
              "
          """
        }
      }
    }

    stage("Health Check") {
      steps {
        sh '''
          TARGET_URL="http://${DEPLOY_HOST}:3333/"
          for i in $(seq 1 12); do
            STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_URL" 2>/dev/null || true)
            if [ "$STATUS" = "200" ]; then
              echo "Health check passed (attempt $i, HTTP $STATUS)"
              exit 0
            fi
            echo "Waiting... ($i/12, HTTP $STATUS)"
            sleep 10
          done
          echo "Health check failed after 2 minutes"
          exit 1
        '''
      }
    }
  }

  post {
    always {
      sh 'docker image prune -f --filter "until=24h" || true'
    }
    success {
      echo "Build/Deploy success: ${env.IMAGE_TAG}"
    }
    failure {
      echo "Build/Deploy failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
    }
  }
}
