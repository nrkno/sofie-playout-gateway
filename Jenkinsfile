@Library('sofie-jenkins-lib') _

pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
          dockerBuild('sofie/tv-automation-playout-gateway')
      }
    }
    stage('Deploy') {
      steps {
          playoutDeploy()
      }
    }
  }
}
