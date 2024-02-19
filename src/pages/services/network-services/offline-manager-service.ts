import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { forkJoin } from "rxjs/observable/forkJoin";
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { DataService } from '../data-services/data-service';

const STORAGE_REQ_KEY = 'storedreq';

@Injectable()
export class OfflineManagerService {
    constructor(
        private storage: Storage,
        private dataService: DataService
    ) { }

    checkForEvents(): Observable<any> {
        return from(this.storage.get(STORAGE_REQ_KEY)).pipe(
            switchMap(storedOperations => {
                let storedObj = JSON.parse(storedOperations);
                if (storedObj && storedObj.length > 0) {
                    return this.sendRequests(storedObj).pipe(
                        finalize(() => { // Local data succesfully synced to API!
                            this.storage.remove(STORAGE_REQ_KEY);
                        })
                    );
                } else { // No local events to sync
                    return of(false);
                }
            })
        )
    }

    storeRequest(data: any) {
        this.storage.get(STORAGE_REQ_KEY).then(storedOperations => {
            let storedObj = JSON.parse(storedOperations);

            if (storedObj) {
                const storedTickets = storedObj[0].tickets;
                const newTickets = data.tickets;
                let mergedTickets = storedTickets.concat(newTickets);
                const finalArray = mergedTickets.filter((item, pos) => mergedTickets.indexOf(item) === pos);
                storedObj[0].tickets = finalArray;
            } else {
                storedObj = [data];
            }
            // Save old & new local transactions back to Storage
            this.storage.set(STORAGE_REQ_KEY, JSON.stringify(storedObj));
        });
    }

    sendRequests(operations: any) {
        let obs = [];

        for (let op of operations) {
            let oneObs = this.dataService.validateTickets(op);
            obs.push(oneObs);
        }
        // Send out all local events and return once they are finished
        return forkJoin(obs);
    }
}