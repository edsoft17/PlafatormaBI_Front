import { MatInputModule } from '@angular/material/input';
import { Component, computed, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { Observable, startWith, map } from 'rxjs';
import { UserCompany } from 'app/core/models/user-company';
import { UserCompanyService } from 'app/core/services/user-company.service';


@Component({
  selector: 'ui-navbar',
  standalone: true,
  imports: [MatFormFieldModule,MatAutocompleteModule,ReactiveFormsModule,MatInputModule,AsyncPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private readonly _userCompanyService = inject(UserCompanyService);

  companies = computed(()=>this._userCompanyService.listCompany());
  myControl = new FormControl("");

  filteredOptions!: Observable<UserCompany[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): UserCompany[] {
    const filterValue = value.toLowerCase();

    return this.companies().filter(option => option.brandName.toLowerCase().includes(filterValue));
  }
}
