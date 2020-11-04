/*
 *  Copyright 2020 EPAM Systems
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

// create mocha instance
const Mocha = require('mocha')

const mochaMain = new Mocha({
  reporter: '@reportportal/agent-js-mocha',
  reporterOptions: {
    endpoint: 'http://127.0.0.1:8080/api/v1',
    token: '252148ac-b24a-46ff-953c-b9e2a4b8b919',
    launch: 'Unit Testing',
    project: 'TEST',
    description: '',
    attributes: [
      {
        key: 'Build',
        value: 'Sherpa API'
      },
      {
        key: 'Version',
        value: '1.0.1'
      },
      {
        value: 'Unit Testing'
      }
    ]
  },
  timeout: 250000
})
/* var mochaMain = new Mocha({
    reporter: 'mocha-junit-reporter',
    reporterOptions: {
        mochaFile: './results.xml'
    }
}); */

// run tests
try {
  mochaMain.files = [
    'test/setup.js',
    'test/app/controller/heartbeat.test.js',
    'test/app/controller/agent.test.js',
    'test/app/controller/singlespa.test.js',
    'test/app/controller/gateway/application.test.js'
  ]
  mochaMain.run((failures) => process.on('exit', () => process.exit(failures))) // exit with non-zero exit code, other wise fails will not fail mocha run
} catch (err) {
  console.error(`Test suite doesn't exists or set. Error: ${err}`)
}
