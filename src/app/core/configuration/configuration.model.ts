import { JsonObject, JsonProperty } from "json2typescript";
import { Base } from "../../common/model/base.model";

@JsonObject("Configuration")
export class Configuration implements Base {
    @JsonProperty('id')
    public id: number;
    @JsonProperty('version')
    public version: number;
    @JsonProperty('application')
    public application: string;
    @JsonProperty('profile')
    public profile: string;
    @JsonProperty('label')
    public label: string;
    @JsonProperty('key')
    public key: string;
    @JsonProperty('value')
    public value: any;

    getId(): string {
        return this.id ? String(this.id) : undefined;
    }

    hasId(): boolean {
        return this.getId() !== undefined;
    }
}
