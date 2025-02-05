import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { FormGroup, FormControl, Validators, ReactiveFormsModule} from "@angular/forms";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule,ButtonModule,ReactiveFormsModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    templateUrl: './login.html',
    styles: `
    .alert {color:red;padding-bottom:10px;}
    input.ng-touched.ng-invalid {border:solid red 2px;}
    input.ng-touched.ng-valid {border:solid green 2px;}
`,
})

export class Login {
    myForm : FormGroup;
    constructor(){
        this.myForm = new FormGroup({

            "userName": new FormControl("", [Validators.required,]),
            "userPassword": new FormControl("", [
                                Validators.required,Validators.minLength(5)
                            ]),
        });
    }

    submit(){
        console.log(this.myForm);
    }
    checked: boolean = false;
}
