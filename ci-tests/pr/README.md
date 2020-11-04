# On PR Tests

These tests are run by Jenkins on a pull request.

Jenkins will use Docker to build a small Alpine container and then install Shield Client and it's dev dependencies in there. It'll then run the tests as defined in bin/dockerTests.sh and output HTML coverage and Cobertura coverage reports. Jenkins will pick these reports up and display them in the Jenkins web UI and also add a comment to the PR with the code coverage percentage.

## Testing on localhost

If you have Docker and Docker Compose installed on your localhost you can run these tests simply by cd'ing into this directory and running

```
./run.sh
```
