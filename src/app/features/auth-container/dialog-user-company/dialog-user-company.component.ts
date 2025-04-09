import { JsonPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { ButtonType } from '@shared/enums/button-type.enum';
import { BiButtonComponent } from 'app/components/bi-button/bi-button.component';
import { AuthService } from 'app/core/auth/auth.service';
import { UserCompany } from 'app/core/models/user-company';
import { UserCompanyService } from 'app/core/services/user-company.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-dialog-user-company',
  standalone: true,
  imports: [MatSelectModule,MatIconModule,MatButtonModule,BiButtonComponent],
  templateUrl: './dialog-user-company.component.html',
  styleUrl: './dialog-user-company.component.scss'
})
export class DialogUserCompanyComponent {
  readonly data!: UserCompany[];
  readonly dialogRef = inject(MatDialogRef<DialogUserCompanyComponent>);

  private readonly _userCompanyService = inject(UserCompanyService);
  private readonly _authService = inject(AuthService);
  
  private readonly _router = inject(Router);

  listUserCompany = computed(()=>this._userCompanyService.listCompany());
  buttonType = ButtonType;

  setCurrenCompany(event: MatSelectChange): void {
    this._userCompanyService.currentCompany.set(event.value);
    localStorage.setItem("currentCompany",String(this._userCompanyService.currentCompany()?.id));
  }

  async navigateToDashboard(): Promise<void> {
    this._router.navigate(["","dashboard"]);
    await this.getMenu();
    this.closeModal();
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  closeModalCompany(): void {
    localStorage.clear();
    this.closeModal();
  }

  async getMenu(): Promise<any> {
    const request = {
      idUsuario: this._authService.currentUser()?.id,
      idPlataforma: 25,
      idEmpresa: this._userCompanyService.currentCompany()?.id
    };
    
    try{
      const response = await lastValueFrom(this._authService.getMenu(request));
      if(response.status.status === 200) {
        localStorage.setItem("menu",JSON.stringify(response.data));
        return response.data
      }
      return null;
    }catch{

    }
  }
}
