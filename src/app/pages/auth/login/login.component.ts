import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services';
import { first } from 'rxjs';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, ButtonModule, ReactiveFormsModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    public readonly form = new FormGroup({
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required, Validators.minLength(5)])
    });

    private readonly _authService = inject(AuthService);
    private readonly _router = inject(Router);
    private readonly _route = inject(ActivatedRoute);

    submit() {
        // this._authService
        //     .login(this.form.value)
        //     .pipe(first())
        //     .subscribe((r) => {
        //         this._authService.setToken(r.access_token);
        //         const returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
        //         this._router.navigateByUrl(returnUrl).then();
        //     });

        const returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
        this._router.navigateByUrl(returnUrl).then();
    }
}
