import {
    BufferedWriter,
    CucumberConsoleReporter,
    DefaultFormatter,
    FailedStep,
    Formatter,
    Result,
} from "../src";

import * as sinon from 'sinon';
import * as chai from 'chai';
chai.use(require('sinon-chai'));
const should = require('chai').should();

export class SimpleTestFormatter implements Formatter {

    feature(text: string): string {
        return text;
    }

    scenario(text: string): string {
        return text;
    }

    step(text: string, result: Result): string {
        return `${text} ${result}`
    }

    summary(success: boolean, passedCount: number, failedCount: number, skippedCount: number, failures: FailedStep[], finalMessage: string): string {
        return `${success} ${passedCount} ${failedCount} ${skippedCount} ${failures} ${finalMessage}`
    }
}


describe('CucumberConsoleReporter', () => {

    const reporterOptions = {
        logStage: 'scenario', // instances > 1 ? 'scenario' : 'step',
        successMessage: 'ALL TESTS PASSED',
        failureMessage: 'SOME TESTS FAILED',
        showTimestamp: true
    };

    const reporter = new CucumberConsoleReporter(reporterOptions, BufferedWriter, SimpleTestFormatter);
    const writerSpy = sinon.spy(reporter.logger, 'log');

    describe('onSuiteStart', () => {

        it('should log a scenario', () => {
            const suite = { type: 'scenario', title: 'My scenario or whatever' };
            reporter.onSuiteStart(suite);
            writerSpy.should.have.been.calledWith(suite.title);
        });

        it('should log a feature', () => {
            const suite = { type: 'feature', title: 'My feature' };
            reporter.onSuiteStart(suite);
            writerSpy.should.have.been.calledWith(suite.title);
        });

        it('should not log a urecognized type', () => {
            const suite = { type: 'xxx', title: 'My whatever' };
            (() => { reporter.onSuiteStart(suite) }).should.throw(Error, 'Suite type xxx is not recognized.')
        });

    });

    describe('onTestPass', () => {

        it('should log a passing step', () => {
            const test = { title: 'My passing step' };
            reporter.onTestPass(test);
            writerSpy.should.have.been.calledWith(`${test.title} ${Result.PASSED}`);
        });

    });

    // describe('onTestFail', () => {
    //
    //     it('should log a failing step', () => {
    //         const test = { title: 'My failing step' };
    //         reporter.onTestFail(test);
    //         writerSpy.should.have.been.calledWith(`${test.title} ${Result.FAILED}`);
    //     });
    //
    // });

    describe('onTestSkip', () => {

        it('should log a skipped step', () => {
            const test = { title: 'My skipped step' };
            reporter.onTestSkip(test);
            writerSpy.should.have.been.calledWith(`${test.title} ${Result.SKIPPED}`);
        });

    });

    // describe('onSuiteEnd', () => {
    //
    //     it('should log a run summary', () => {
    //         const suite = { title: 'My skipped step' };
    //         reporter.onSuiteEnd(suite);
    //         writerSpy.should.have.been.calledWith(`XXX`);
    //     });
    //
    // });

    describe('onRunnerEnd', () => {

    });

});