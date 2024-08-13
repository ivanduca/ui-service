import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { LoadingState } from '../auth/loading-state.enum';
import { NotificationPosition } from 'design-angular-kit';

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

    public sendMessage(type: MessageType, message: string, position?: NotificationPosition) {
        if (message) {
            this.translateService.get(message).subscribe((label: string) => {
                this.onApiMessage.next(new ApiMessage(type, label, position));
            });    
        }
    }

    public addLoading(loadingState: LoadingState) {
        this.loadingEventSource.next(loadingState);
    }
}

export class ApiMessage {
    constructor(public type: MessageType, public message: string, public position?: NotificationPosition) {}
}

export enum MessageType {
    ERROR,
    SUCCESS,
    WARNING
}
