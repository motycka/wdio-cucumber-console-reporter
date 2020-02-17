import chalk from "chalk";
import moment = require('moment');
import {FailedStep, Result, StepError} from "./reporter";

export interface Formatter {
    feature(text: string): string;
    scenario(text: string): string;
    step(text: string, result: Result): string;
    summary(success: boolean, passedCount: number, failedCount: number, skippedCount: number, failures: FailedStep[], finalMessage: string): string;
}

export interface FormatterOptions {
    showTimestamp: boolean;
    timestampFormat: string;
}

export class DefaultFormatter implements Formatter {

    constructor(private options: FormatterOptions) {}

    feature(text: string): string {
        return `${chalk.black.bold('Feature:')} ${chalk.green.bold(`${text}`)}\n`;
    }

    scenario(text: string): string {
        return `    ${chalk.black.bold('Scenario:')} ${chalk.green.bold(`${text}\n`)}`;
    }

    step(text: string, result: Result): string {
        const date = this.options.showTimestamp ? chalk.grey(`${moment().format(this.options.timestampFormat)}`) : '    ';
        const decorate = (s: string, t: string) => `${date}    ${s} ${t}\n`;
        switch (result) {
            case Result.PASSED:
                return chalk.green(decorate('✔', text));
            case Result.FAILED:
                return date + chalk.red(decorate('✖', text));
            case Result.SKIPPED:
                return date + chalk.yellow(decorate('-', text));
            default:
                throw new Error(`Undefined result ${result}`);
        }
    }

    summary(success: boolean, passedCount: number, failedCount: number, skippedCount: number, failures: FailedStep[], finalMessage: string): string {
        const summary = chalk.bold(
            `\n\nPassed: ${chalk.green(passedCount.toString())}, Failed: ${chalk.red(failedCount.toString())}, Skipped: ${chalk.yellow(skippedCount.toString())}\n`
        );
        if (success === false) {
            return failures.map((error: FailedStep) => {
                const feature  = this.feature(error.feature);
                const scenario = this.scenario(error.scenario);
                const step     = this.step(error.step, Result.FAILED);
                const errors   = error.errors.map((e: StepError) => `            ${e.stackTrace}`).join('\n');
                return feature + scenario + step + errors + '\n\n';
            }) + summary + chalk.red(`\n${finalMessage}\n\n`);
        } else {
            return summary + chalk.green(`\n${finalMessage}\n\n`);
        }
    }
}