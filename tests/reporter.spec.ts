import {CucumberConsoleReporter, FailedStep, Result, Stage} from "../src/reporter";

import * as sinon from 'sinon';
import * as chai from 'chai';
import {Formatter} from "../src/formatter";
import {BufferedWriter} from "../src/writer";
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
    const logSpy = sinon.spy(reporter.logger, 'log');
    const finalizeSpy = sinon.spy(reporter.logger, 'finalize');

    describe('onSuiteStart', () => {

        it('should log a scenario', () => {
            const suite = { type: 'scenario', title: 'My scenario or whatever' };
            reporter.onSuiteStart(suite);
            logSpy.should.have.been.calledWith(suite.title);
        });

        it('should log a feature', () => {
            const suite = { type: 'feature', title: 'My feature' };
            reporter.onSuiteStart(suite);
            logSpy.should.have.been.calledWith(suite.title);
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
            logSpy.should.have.been.calledWith(`${test.title} ${Result.PASSED}`);
            finalizeSpy.should.have.been.calledWith(Result.PASSED);
        });

    });

    describe('onTestFail', () => {

        it('should log a failing step', () => {
            const test = { title: 'My failing step', errors: [new Error('xxx')] };
            reporter.onTestFail(test);
            logSpy.should.have.been.calledWith(`${test.title} ${Result.FAILED}`);
            finalizeSpy.should.have.been.calledWith(Stage.STEP);
        });

    });

    describe('onTestSkip', () => {

        it('should log a skipped step', () => {
            const test = { title: 'My skipped step' };
            reporter.onTestSkip(test);
            logSpy.should.have.been.calledWith(`${test.title} ${Result.SKIPPED}`);
            finalizeSpy.should.have.been.calledWith(Stage.STEP);
        });

    });

    describe('onSuiteEnd', () => {

        it('should log a run summary', () => {
            const suite = { tests: [ {state: 'passed'}, {state: 'failed'}, {state: 'skipped'} ] };
            reporter.onSuiteEnd(suite);
            logSpy.should.have.been.calledWith('\n');
            finalizeSpy.should.have.been.calledWith(Stage.STEP);
        });

    });

    describe('onRunnerEnd', () => {

        it('should finalize test', () => {
            const suite = { tests: [ {state: 'passed'}, {state: 'failed'}, {state: 'skipped'} ] };
            reporter.onRunnerEnd();
            logSpy.should.have.been.calledWith('My scenario or whatever');
            logSpy.should.have.been.calledWith('My feature');
            logSpy.should.have.been.calledWith('My passing step 0');
            logSpy.should.have.been.calledWith('My failing step 1');
            logSpy.should.have.been.calledWith('My skipped step 2');
            finalizeSpy.should.have.been.calledWith(Stage.STEP);
        });

    });

});