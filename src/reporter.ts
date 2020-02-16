import WDIOReporter from '@wdio/reporter';
import {
    DefaultFormatter,
    Formatter,
    FormatterOptions,
    BufferedWriter,
    Writer,
    FailedStep,
    Stage,
    StepError,
    Result
} from "./";

export class CucumberConsoleReporter<T extends Writer> extends WDIOReporter {

    private currentFeature = undefined;
    private currentScenario = undefined;
    private scenariosPassed = 0;
    private scenariosSkipped = 0;
    private scenariosFailed = 0;
    private failures: FailedStep[] = [];
    private formatter: Formatter;
    public logger: Writer;
    private finalSuccessMessage: string;
    private finalFailuresMessage: string;

    constructor(private options, private writer: new (stage: Stage) => Writer = BufferedWriter, private frmtr: new (options: FormatterOptions) => Formatter = DefaultFormatter) {
        super(options);
        switch (options.logStage) {
            case 'step':
                this.logger = new this.writer(Stage.STEP);
                break;
            case 'scenario':
                this.logger = new this.writer(Stage.SCENARIO);
                break;
            case 'feature':
                this.logger = new this.writer(Stage.FEATURE);
                break;
            default:
                this.logger = new this.writer(Stage.STEP);
        }
        this.finalSuccessMessage = options.successMessage === undefined ? '' : options.successMessage;
        this.finalFailuresMessage = options.failureMessage === undefined  ? '' : options.failureMessage;
        this.formatter = new this.frmtr({
            showTimestamp: options.showTimestamp === undefined ? false : options.showTimestamp,
            timestampFormat: options.timestampFormat === undefined ? 'hh:mm:ss' : options.timestampFormat
        });
    }

    onRunnerStart(): void {}
    onBeforeCommand(): void {}
    onAfterCommand(): void {}
    onScreenshot(): void {}
    onHookStart(): void {}
    onHookEnd(): void {}
    onTestStart(): void {}
    onTestEnd (): void {}

    onSuiteStart(suite) {
        switch (suite.type) {
            case 'feature':
                this.logger.log(this.formatter.feature(suite.title));
                this.currentFeature = suite.title;
                break;
            case 'scenario':
                this.logger.log(this.formatter.scenario(suite.title));
                this.currentScenario = suite.title;
                break;
            default:
                throw new Error(`Suite type ${suite.type} is not recognized.`)
        }
        this.logger.log('\n');
    }

    onTestPass(test): void {
        this.logger.log(this.formatter.step(test.title, Result.PASSED));
        this.logger.finalize(Stage.STEP);
    }

    onTestFail(test): void {
        this.logger.log(this.formatter.step(test.title, Result.FAILED));
        this.failures.push(new FailedStep(
            this.currentFeature,
            this.currentScenario,
            test.title,
            test.errors.map((error: any) => {
                return new StepError(
                    error.message,
                    error.stack,
                );
            })
        ));
        this.logger.finalize(Stage.STEP);
    }

    onTestSkip(test): void {
        this.logger.log(this.formatter.step(test.title, Result.SKIPPED));
        this.logger.finalize(Stage.STEP);
    }

    onSuiteEnd(suite): void {
        const passed = suite.tests.every((test: any) => test.state === 'passed');
        const skipped = suite.tests.some((test: any) => test.state === 'skipped');
        const failed = suite.tests.some((test: any) => test.state === 'failed');
        if (passed) { this.scenariosPassed++; }
        if (skipped) { this.scenariosSkipped++; }
        if (failed) { this.scenariosFailed++; }
        this.logger.log('\n');
        this.logger.finalize(Stage.SCENARIO);
    }

    onRunnerEnd(): void {
        this.logger.log(this.formatter.summary(
            this.scenariosFailed === 0,
            this.scenariosPassed,
            this.scenariosFailed,
            this.scenariosSkipped,
            this.failures,
            this.scenariosFailed === 0 ? this.finalSuccessMessage : this.finalFailuresMessage
        ));
        this.logger.finalize(Stage.FEATURE);
    }

}