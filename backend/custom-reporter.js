class CleanReporter {
  onRunComplete(contexts, results) {
    console.log('\n');
    console.log('='.repeat(50));
    console.log('🧪  WELILE TEST RESULTS');
    console.log('='.repeat(50));
    console.log('\n');

    results.testResults.forEach(testSuite => {
      testSuite.testResults.forEach(result => {
        if (result.status === 'passed') {
          console.log(`✅  PASS:  ${result.title}`);
        } else if (result.status === 'failed') {
          console.log(`❌  FAIL:  ${result.title}`);
          result.failureMessages.forEach(msg => console.log(`\n      ${msg}\n`));
        } else {
          console.log(`🟡  SKIP:  ${result.title}`);
        }
      });
    });

    console.log('\n' + '-'.repeat(50));
    console.log(`📊  Total: ${results.numTotalTests} | ✅ Passed: ${results.numPassedTests} | ❌ Failed: ${results.numFailedTests}`);
    console.log('-'.repeat(50) + '\n');
  }
}

module.exports = CleanReporter;
