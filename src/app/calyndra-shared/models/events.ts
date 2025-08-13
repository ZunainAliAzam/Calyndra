import { IBase } from "../interface/base";

interface IEvent extends IBase {
    event: string;
    date: string;
    location: string;
    type: string;
}
export class EventsModel {
    event: string;
    date: string;
    location: string;
    type: string;
    constructor(events: IEvent){
        this.event = events.event;
        this.date = events.date;
        this.location = events.location;
        this.type = events.type;
    }
}
