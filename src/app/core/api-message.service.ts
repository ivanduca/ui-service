import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { LoadingState } from '../auth/loading-state.enum';

@Injectable()
export class ApiMessageService {
    constructor(public translateService: TranslateService) {}

    private loadingEventSource: Subject<LoadingState> = new Subject();
    // Observable LoadingState streams
    loadingEvent$ = this.loadingEventSource.asObservable();
  
    // Messaggi emessi dagli api services
    public onApiMessage = new Subject<ApiMessage>();

    // Loader component
    public onLoad = new Subject<boolean>();

    public sendMessage(type: MessageType, message: string) {
        if (message) {
            this.translateService.get(message).subscribe((label: string) => {
                this.onApiMessage.next(new ApiMessage(type, label));
            });    
        }
    }

    public addLoading(loadingState: LoadingState) {
        this.loadingEventSource.next(loadingState);
    }
}

export class ApiMessage {
    constructor(public type: MessageType, public message: string) {}
}

export enum MessageType {
    ERROR,
    SUCCESS,
    WARNING
}
