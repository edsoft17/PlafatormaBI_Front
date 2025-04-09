import { Injectable, signal } from '@angular/core';
import { UserCompany } from '../models/user-company';
import { MenuEntity } from '../entities/menu/menu.entity';

@Injectable({
    providedIn: 'root',
})
export class MenuService {
    listMenu = signal<MenuEntity | null>(null);

    constructor(){ }

}
