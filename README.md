## Install

```
npm install --save-dev wdio-cucumber-console-reporter
```

## Configuration

Add the following lines to reporters section in webdriver.io configuration file:
 
```
 reporters: [
     [CucumberConsoleReporter, {}]
 ]
```

### Options

| **Option**        | **Type** | **Description**                                                                                                                                                                                   |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `logStage`        | string   | Specify at what stage should the reporter write the log. This is useful for tests that run in parallel, so that the step logs don't mix together. Valid options are `feature`, `scenario`, `step` |
| `successMessage`  | string   | Text that should be written on success. This is useful if you need to, for example, parse logs for success or failure.                                                                            |
| `failureMessage`  | string   | Text that should be written on failure. This is useful if you need to, for example, parse logs for success or failure.                                                                            |
| `showTimestamp`   | boolean  | Show timestamp with every step.                                                                                                                                                                   |
| `timestampFormat` | string   | Timestamp format. For example `hh:mm:ss`                                                                                                                                                          |

```
reporters: [
    [CucumberConsoleReporter,
        {
            logStage: 'scenario', // feature | scenario | step
            successMessage: 'ALL TESTS PASSED',
            failureMessage: 'SOME TESTS FAILED',
            showTimestamp: true,
            timestampFormat: 'hh:mm:ss'
        }
    ]
]
```
