@Library('sofie-jenkins-lib') _

pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sofieSlackSendBuildStarted()
        dockerBuild('sofie/tv-automation-playout-gateway')
      }
    }
    stage('Deploy') {
      steps {
        playoutDeploy()
      }
    }
  }
  post {
    failure {
      sofieSlackSendBuildFailure()
    }
    success {
      sofieSlackSendBuildSuccess()
    }
  }
}
