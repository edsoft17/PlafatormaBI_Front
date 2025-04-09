import { inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { FormLogin } from "./auth.models";

export class AuthPresenter {
    private readonly _fb = inject(FormBuilder);

    private sendForm = new Subject<FormLogin>();

    get sendForm$(): Observable<FormLogin> {
        return this.sendForm.asObservable();
    }

    initForm(): FormGroup {
        return this._fb.group({
            typeDocument: ["", Validators.required],
            document: ["41419210", Validators.required],
            password: ["654321", Validators.required]
        });
    }

    sendFormValue(form: FormGroup): void {
        if(form.invalid){
            form.markAllAsTouched();
            return;
        }
        
        this.sendForm.next(form.value);
    }
}