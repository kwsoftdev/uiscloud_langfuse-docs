// Jenkins pipeline for langfuse-docs.
//
// Scope: build the production image (Dockerfile.prod) and push it to Docker
// Hub. Actual deployment (running the new image on the target host/cluster)
// is intentionally out of scope — it's handled by a separate process/tool.
//
// Required Jenkins setup (configure once, outside this file):
//   - Plugins: "Docker Pipeline", "Git".
//   - The Jenkins agent needs Docker CLI + daemon access (it builds/pushes
//     images directly — no Docker-in-Docker is configured here).
//   - A "Username with password" credential for Docker Hub, ID matching
//     DOCKERHUB_CREDENTIALS_ID below (username + access token, not your
//     account password).
//   - IMAGE_NAME below must be set to your actual Docker Hub repo
//     (e.g. "your-org/langfuse-docs").
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

pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: "20"))
  }

  environment {
    // TODO: set this to your actual Docker Hub repo, e.g. "your-org/langfuse-docs".
    IMAGE_NAME = "your-org/langfuse-docs"
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
  }

  post {
    always {
      sh 'docker image prune -f --filter "until=24h" || true'
    }
  }
}
