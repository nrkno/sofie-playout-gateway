@Library('sofie-jenkins-lib') _

pipeline {
  agent any
  stages {
    stage('Version') {
      when {
        branch 'master'
      }
      steps {
        versionRelease()
      }
    }
    stage('Build') {
      steps {
        sofieSlackSendBuildStarted()
        dir('static') {
          git url: 'git@github.com:nrkno/tv-automation-static-assets.git'
        }
        dockerBuild('sofie/tv-automation-playout-gateway')
      }
    }
    stage('Deploy') {
      when {		
        branch 'stage'		
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
