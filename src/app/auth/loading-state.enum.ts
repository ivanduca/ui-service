export enum LoadingStateEnum {
    DEFAULT,
    START,
    COMPLETE,
    ERORR
}

export class LoadingState {
    public url: string;
    public state: LoadingStateEnum;
    public static DEFAULT: LoadingState = new LoadingState(undefined, LoadingStateEnum.DEFAULT);
    constructor(url: string, state: LoadingStateEnum) {
        this.url = url;
        this.state = state;
    }

    public isStarting() {
        return this.state === LoadingStateEnum.START;
    }

    public isFinish() {
        return this.state === LoadingStateEnum.COMPLETE || this.state === LoadingStateEnum.ERORR;
    }

}