export * from './reporter'
export * from './formatter'
export * from './writer'

export enum Result {
    PASSED, FAILED, SKIPPED
}

export enum Stage {
    STEP, SCENARIO, FEATURE
}

export class FailedStep {
    constructor(
        public feature: string,
        public scenario: string,
        public step: string,
        public errors: StepError[],
    ) {}
}

export class StepError {
    constructor(
        public message: string,
        public stackTrace: string
    ) {}
}
