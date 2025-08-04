import { JsonProperty, JsonObject } from 'json2typescript';
import { ISODateTimeConverter } from '../../common/helpers/ISODateTimeConverter';
import { Base } from '../../common/model/base.model';
import { Company } from '../company/company.model';

@JsonObject("StorageData")
export class StorageData {
    @JsonProperty('objectBucket')
    public objectBucket: string;
    @JsonProperty('objectId')
    public objectId: string;
    @JsonProperty('objectResult')
    public objectResult: string;
    @JsonProperty('screenshotBucket')
    public screenshotBucket: string;
    @JsonProperty('screenshotId')
    public screenshotId: string;
    @JsonProperty('screenshotResult')
    public screenshotResult: string;
}


@JsonObject("Result")
export class Result implements Base {
    @JsonProperty('id')
    public id: number; 

    @JsonProperty('company', Company)
    public company: Company; 

    @JsonProperty('storageData')
    public storageData: StorageData; 

    @JsonProperty('status')
    public status: number; 
    @JsonProperty('ruleName')
    public ruleName: string;
    @JsonProperty('errorMessage')
    public errorMessage: string;
    @JsonProperty('destinationUrl')
    public destinationUrl: string;
    @JsonProperty('term')
    public term: string;
    @JsonProperty('content')
    public content: string;
    @JsonProperty('workflowId')
    public workflowId: string;
    @JsonProperty('workflowChildId')
    public workflowChildId: string;
    @JsonProperty('score')
    public score: number;

    @JsonProperty('createdAt', ISODateTimeConverter)
    public createdAt: Date;
    @JsonProperty('updatedAt', ISODateTimeConverter)
    public updatedAt: Date;

    public get color() {
        switch(this.status) {
            case 200: return 'success';
            case 202: return 'warning';
            case 400: return 'danger';
            case 404: return 'danger';
            case 407: return 'danger';
            case 500: return 'danger';
            default: return 'primary';
        }
    }

    getId(): string {
        return String(this.id);
    }
    hasId(): boolean {
        return this.getId() !== undefined;
    }
    
}