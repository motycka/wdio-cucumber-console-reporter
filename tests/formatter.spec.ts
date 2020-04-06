import {FailedStep, Result, StepError} from "../src/reporter";
import {DefaultFormatter} from "../src/formatter";
import * as sinon from 'sinon';
import * as chai from 'chai';
const expect = chai.expect;
const supportsColor = require('supports-color');

describe('Formatter', () => {

    const failedStep = new FailedStep(
        "My Feature", "My Scenario", "failed step", [new StepError("this failed", "xxx")]
    );

    if (supportsColor.stdout && supportsColor.stdout.has256) {
        console.log('Testing colored outputs');

        const FEATURE_TEXT = "\u001b[30m\u001b[1mFeature:\u001b[22m\u001b[39m \u001b[32m\u001b[1mMy Feature\u001b[22m\u001b[39m\n";
        const SCENARIO_TEXT = "    [30m[1mScenario:[22m[39m [32m[1mMy Scenario[22m[39m\n" +
            "[32m[1m[22m[39m";
        const SUMMARY_PASSED_TEXT = "[1m[22m\n" +
            "[1m[22m\n" +
            "[1mPassed: [32m42[39m, Failed: [31m0[39m, Skipped: [33m1[39m[22m\n" +
            "[1m[22m[32m[39m\n" +
            "[32mPASSED[39m\n" +
            "[32m[39m\n" +
            "[32m[39m";

        describe('without timestamp', () => {

            const formatter = new DefaultFormatter({showTimestamp: false, timestampFormat: ''});

            it('should return formatted feature', () => {
                expect(formatter.feature('My Feature')).to.equal(FEATURE_TEXT);
            });

            it('should return formatted scenario', () => {
                expect(formatter.scenario('My Scenario')).to.equal(SCENARIO_TEXT);
            });

            it('should return formatted passed step', () => {
                expect(formatter.step('passing step', Result.PASSED))
                    .to.equal("[32m        ✔ passing step[39m\n[32m[39m");
            });

            it('should return formatted failed step', () => {
                expect(formatter.step('failing step', Result.FAILED))
                    .to.equal("    [31m        ✖ failing step[39m\n" +
                    "[31m[39m");
            });

            it('should return formatted skipped step', () => {
                expect(formatter.step('skipped step', Result.SKIPPED))
                    .to.equal("    [33m        - skipped step[39m\n" +
                    "[33m[39m");
            });

            it('should return formatted passed summary', () => {
                expect(formatter.summary(true, 42, 0, 1, [], 'PASSED'))
                    .to.equal(SUMMARY_PASSED_TEXT);
            });

            it('should return formatted failed summary', () => {
                expect(formatter.summary(false, 40, 2, 1, [failedStep], 'FAILED'))
                    .to.equal("[30m[1mFeature:[22m[39m [32m[1mMy Feature[22m[39m\n" +
                    "    [30m[1mScenario:[22m[39m [32m[1mMy Scenario[22m[39m\n" +
                    "[32m[1m[22m[39m    [31m        ✖ failed step[39m\n" +
                    "[31m[39m            xxx\n" +
                    "\n" +
                    "[1m[22m\n" +
                    "[1m[22m\n" +
                    "[1mPassed: [32m40[39m, Failed: [31m2[39m, Skipped: [33m1[39m[22m\n" +
                    "[1m[22m[31m[39m\n" +
                    "[31mFAILED[39m\n" +
                    "[31m[39m\n" +
                    "[31m[39m");
            });

        });

        describe('with timestamp', () => {

            const formatter = new DefaultFormatter({showTimestamp: true, timestampFormat: 'hh:mm:ss'});

            beforeEach(() => {
                this.clock = date => sinon.useFakeTimers(new Date(date));
                this.clock('2020-02-16T11:12:13'); // calling moment() will now return July 7th, 2019.
            });

            it('should return formatted feature', () => {
                expect(formatter.feature('My Feature'))
                    .to.equal(FEATURE_TEXT);
            });

            it('should return formatted scenario', () => {
                expect(formatter.scenario('My Scenario'))
                    .to.equal(SCENARIO_TEXT);
            });

            it('should return formatted passed step', () => {
                expect(formatter.step('passing step', Result.PASSED))
                    .to.equal("[32m[90m11:12:13[39m[32m    ✔ passing step[39m\n" +
                    "[32m[39m");
            });

            it('should return formatted failed step', () => {
                expect(formatter.step('failing step', Result.FAILED))
                    .to.equal("[90m11:12:13[39m[31m[90m11:12:13[39m[31m    ✖ failing step[39m\n" +
                    "[31m[39m");
            });

            it('should return formatted skipped step', () => {
                expect(formatter.step('skipped step', Result.SKIPPED))
                    .to.equal("[90m11:12:13[39m[33m[90m11:12:13[39m[33m    - skipped step[39m\n" +
                    "[33m[39m");
            });

            it('should return formatted passed summary', () => {
                expect(formatter.summary(true, 42, 0, 1, [], 'PASSED'))
                    .to.equal(SUMMARY_PASSED_TEXT);
            });

            it('should return formatted passed summary', () => {
                expect(formatter.summary(false, 40, 2, 1, [failedStep], 'FAILED'))
                    .to.equal("[30m[1mFeature:[22m[39m [32m[1mMy Feature[22m[39m\n" +
                    "    [30m[1mScenario:[22m[39m [32m[1mMy Scenario[22m[39m\n" +
                    "[32m[1m[22m[39m[90m11:12:13[39m[31m[90m11:12:13[39m[31m    ✖ failed step[39m\n" +
                    "[31m[39m            xxx\n" +
                    "\n" +
                    "[1m[22m\n" +
                    "[1m[22m\n" +
                    "[1mPassed: [32m40[39m, Failed: [31m2[39m, Skipped: [33m1[39m[22m\n" +
                    "[1m[22m[31m[39m\n" +
                    "[31mFAILED[39m\n" +
                    "[31m[39m\n" +
                    "[31m[39m");
            });

        });

    } else {
        console.log('Formatter tests skipped because terminal does not support colors.');
    }

});