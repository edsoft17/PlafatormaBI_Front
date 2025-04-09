import { Injectable, signal } from '@angular/core';
import { UserCompany } from '../models/user-company';

@Injectable({
    providedIn: 'root',
})
export class UserCompanyService {
    listCompany = signal<UserCompany[]>([]);
    currentCompany = signal<UserCompany | null>(null);

    constructor(){ }

}
