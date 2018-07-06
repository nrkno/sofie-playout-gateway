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
      when {
        branch 'develop'
      }
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
