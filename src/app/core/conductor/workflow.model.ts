import { JsonProperty, JsonObject } from 'json2typescript';
import { DateTimeConverter } from '../../common/helpers/DateTimeConverter';
import { Base } from '../../common/model/base.model';

@JsonObject("Task")
export class Task {
    @JsonProperty('referenceTaskName')
    public referenceTaskName: string;
    @JsonProperty('outputData')
    public outputData: any;
}

@JsonObject("Workflow")
export class Workflow implements Base {
    @JsonProperty('workflowId')
    public workflowId: string;
    @JsonProperty('workflowName')
    public workflowName: string;    
    @JsonProperty('version')
    public version: number;   
    @JsonProperty('startTime', DateTimeConverter)
    public startTime: Date;
    @JsonProperty('updateTime', DateTimeConverter)
    public updateTime: Date;
    @JsonProperty('endTime', DateTimeConverter)
    public endTime: Date;    
    @JsonProperty('status')
    public status: string;
    @JsonProperty('tasks')
    public tasks: Task[];


    public get executionTime(): number {
        if (this.endTime) {
            return this.endTime.getTime() - this.startTime.getTime();
        }
        return 0;
    } 

    private result_count: any;
    public totalResult: number;
    public isLoadingCsv: boolean = false;

    constructor() {
    }

    public get badge() : string {
        switch(this.status) {
            case 'RUNNING': return 'primary';
            case 'COMPLETED': return 'success';
            case 'FAILED': return 'danger';
            case 'TERMINATED': return 'danger';
            case 'PAUSED': return 'warning';
            default: return 'primary';
        }
    }

    public isTotalCompleted(): boolean {
        return this.resultCount !== undefined;
    }

    public set resultCount(result: any) {
        this.result_count = result;
        this.totalResult = undefined;
        if (result) {
            this.totalResult = 0;
            Object.keys(result).forEach((key) => {
                this.totalResult += result[key];
            });    
        }
    }

    public get resultCount() {
        return this.result_count;
    }

    public getResultFromStatus(status: string): number {
        if (this.resultCount) {
            if (this.resultCount[status]) {
                return this.resultCount[status];
            }
            return 0;
        }
        return undefined;
    } 



    getId(): string {
        return this.workflowId;
    }

    hasId(): boolean {
        return this.getId() !== undefined;
    }
  
}
