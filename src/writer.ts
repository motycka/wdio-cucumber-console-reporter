import {Stage} from "./";

export interface Writer {
    log(text: any);
    finalize(currentStage: Stage): void;
}

export class BufferedWriter implements Writer {

    private buffer: string[] = [];

    constructor(private writeStage: Stage) {}

    log(text: any) {
        this.buffer.push(text);
    }

    finalize(currentStage: Stage): void {
        if (currentStage === this.writeStage || currentStage === Stage.FEATURE) {
            this.buffer.forEach((text: string) => process.stdout.write(text));
            this.buffer = [];
        }
    }

}
