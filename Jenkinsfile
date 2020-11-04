pipeline {
  //copy from https://github.com/iixlabs/node-cloud-service/blob/master/Jenkinsfile
  agent {
      label 'console-core'
  }

  parameters{
      gitParameter(branch: '', branchFilter: '.*',
          defaultValue: 'LATEST', description: '', listSize: '10',
          name: 'TAG', quickFilterEnabled: false, selectedValue: 'NONE',
          sortMode: 'DESCENDING_SMART', tagFilter: '*', type: 'PT_TAG'
      )
  }

  environment {
      DOCKER_REGISTRY = "quay.io/consoleconnect"
      DOCKER_IMAGE = "console_core_service_sherpa"
      DEV_NAMESPACE = "portal-dev"
      DEV_PLATFORM_DEPLOYMENT_NAME = "console-core-service-sherpa"
      DOCKER_COMMAND = "sudo docker"
      BRANCH = "develop"
  }

  options {
      disableConcurrentBuilds()
  }

  stages {

      stage("Checkout") {
          steps {
              checkout([$class: 'GitSCM',
                  branches: [[name: 'refs/tags/*']],
                  doGenerateSubmoduleConfigurations: false,
                  userRemoteConfigs: [[
                      refspec: '+refs/tags/*:refs/remotes/origin/tags/*',
                      url: 'git@github.com:iixlabs/console-core-service-sherpa.git']]
              ])

          }
      }

      stage('Git latest tag override') {
          when {
              expression { params.TAG == "LATEST" }
          }
          environment{
              // This grabs the latest tag by date
              TAG_DETAILS = sh(script: "git for-each-ref --sort=taggerdate --format '%(refname) %(taggerdate)' refs/tags | tail -n 1", returnStdout: true)
              BRANCH = sh(script: "awk '{print \$1}' <<< \"${TAG_DETAILS}\"", returnStdout: true)
              VERSION = sh(script: "sed 's/[^0-9.]*//g' <<< \"${BRANCH}\" | xargs", returnStdout: true)
              TAG_EXISTS = sh(script: "sudo skopeo inspect docker://${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${VERSION}", returnStatus: true)
          }
          steps {
              sh "if [ $TAG_EXISTS -eq 0 ]; then echo \"Tag exists in Quay! Aborting...\" && exit 1; fi"
              sh 'echo $TAG_DETAILS'
              sh 'echo $BRANCH'
              sh 'git checkout $BRANCH'
              sh 'git status'
              sh 'git tag --contains | head -1'
          }

      }

      stage('Checkout tag to build') {
          when {
              expression { params.TAG != "LATEST" }
          }
          environment {
              VERSION = sh(script: "sed 's/[^0-9.]*//g' <<< \"${params.TAG}\"", returnStdout: true).trim()
              TAG_EXISTS = sh(script: "sudo skopeo inspect docker://${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${VERSION}", returnStatus: true)
          }
          steps {
              sh 'if [ $TAG_EXISTS -eq 0 ]; then echo "Tag exists in Quay! Aborting..." && exit 1; fi'
              sh "echo 'Will check out ${params.TAG}'"
              sh "git checkout ${params.TAG}"
              sh 'git status'
              sh 'git tag --contains | head -1'
          }
      }

//      stage('Compile and Package') {
//
//          steps {
//              sh 'scripts/build.sh'
//          }
//
//      }

	  stage('Container build') {
          environment {
              NPM_TOKEN = credentials('e11a2808-8182-4636-b0b7-fd938ce00824')
              PKG_JSON_VERSION = sh(script: "jq -r .version < package.json", returnStdout: true).trim()
          }
          steps {
              sh "echo Found $PKG_JSON_VERSION version in package.json"
			        sh 'scripts/dockerBuild.sh'
          }

      }

       stage('Container dry-run') {
          environment {
              PKG_JSON_VERSION = sh(script: "jq -r .version < package.json", returnStdout: true).trim()
          }
          steps {
              sh "echo Trying to start latest build"
              //sh 'scripts/dockerDryRun.sh'
          }

      }

      stage('Container Tag and Push') {
          environment {
              PKG_JSON_VERSION = sh(script: "jq -r .version < package.json", returnStdout: true).trim()
          }
          steps {
              sh "echo Found $PKG_JSON_VERSION version in package.json"
    		  sh 'scripts/dockerTagAndPush.sh'
          }

      }

      stage('Deploy build') {
          environment {
              PKG_JSON_VERSION = sh(script: "jq -r .version < package.json", returnStdout: true).trim()
          }
          steps {
              script {
                  if (env.PKG_JSON_VERSION.split('\\.')[1].toInteger() % 2 == 0) {
                      targetEnv = "UAT"
                  } else {
                      targetEnv = "Dev"
                  }
                  echo "${env.PKG_JSON_VERSION} will be deployed to ${targetEnv}"
                  build job: 'PSR - Deploy new version', parameters: [
                    string(name: 'UPSTREAM_URL', value: "${env.BUILD_URL}"),
                    string(name: 'SERVICE', value: 'SHERPA-API'),
                    string(name: 'ENVIRONMENT', value: "${targetEnv}"),
                    string(name: 'VERSION', value: "${env.PKG_JSON_VERSION}")
                  ]
              }
          }
      }
  }

  post {
      success {
          slackSend color: 'good', tokenCredentialId: 'slack-jenkins', message: "${env.JOB_NAME} #${env.BUILD_NUMBER} status: <${env.BUILD_URL}|SUCCESS>"
      }
      unstable {
          slackSend color: 'warning', tokenCredentialId: 'slack-jenkins', message: "${env.JOB_NAME} #${env.BUILD_NUMBER} status: <${env.BUILD_URL}|UNSTABLE>"
      }
      failure {
          slackSend color: 'danger', tokenCredentialId: 'slack-jenkins', message: "${env.JOB_NAME} #${env.BUILD_NUMBER} status: <${env.BUILD_URL}|FAILURE>"
      }
      cleanup {
          cleanWs()
      }
  }
}
