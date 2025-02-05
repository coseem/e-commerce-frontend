import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { first } from 'rxjs';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, ButtonModule, ReactiveFormsModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    public form: FormGroup;
    private authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    constructor() {
        this.form = new FormGroup({
            username: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required, Validators.minLength(5)])
        });
    }

    submit() {
        this.authService
            .login(this.form.value)
            .pipe(first())
            .subscribe((r) => {
                this.authService.setToken(r.access_token);
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                this.router.navigateByUrl(returnUrl).then();
            });
    }
}
