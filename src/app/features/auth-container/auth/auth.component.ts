import { Component, EventEmitter, inject, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';

import { AuthPresenter } from './auth.presenter';
import { TypeDocument } from 'app/core/models/type-document.model';
import { FormLogin } from './auth.models';
import { DialogUserCompanyComponent } from '../dialog-user-company/dialog-user-company.component';

@Component({
  selector: 'ui-auth',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [MatButtonModule, MatSelectModule, ReactiveFormsModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  providers: [AuthPresenter]
})
export class AuthComponent implements OnInit {
  @Input() typesDocument!: TypeDocument[];

  @Output() eventSignIn: EventEmitter<FormLogin> = new EventEmitter<FormLogin>();

  private readonly _dialog = inject(MatDialog);

  private readonly _authPresenter = inject(AuthPresenter);

  authForm!: FormGroup;
  hide: boolean = true;

  ngOnInit(): void {
    this.authForm = this._authPresenter.initForm();
    this._authPresenter.sendForm$.subscribe(data => this.eventSignIn.emit(data));
  }

  signIn(): void {
    this.eventSignIn.emit(this.authForm.value);
  }

  openDialog(): void {
		const respDialogo = this._dialog.open(DialogUserCompanyComponent, {
		  disableClose: true,
			width: "500px",
		  minWidth: "350px"
		});
		respDialogo.beforeClosed().subscribe(res => {
		    if(res){
			    
		    }
		});
	}
}
