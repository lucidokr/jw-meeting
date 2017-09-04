import {Injectable, EventEmitter} from '@angular/core';
import {Subject} from "rxjs";

@Injectable()
export class EmitterService {
    private _emitters: { [Id: string]: EventEmitter<any>} = {};

    get(Id: string): EventEmitter<any> {
        if (!this._emitters[Id]) {
            this._emitters[Id] = new EventEmitter();
        }
        return this._emitters[Id];
    }
}
