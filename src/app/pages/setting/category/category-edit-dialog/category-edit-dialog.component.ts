import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../../services';
import { finalize, first, Observable } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ICategory } from '../../../../interfaces';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Button } from 'primeng/button';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-category-edit-dialog',
    imports: [InputText, ReactiveFormsModule, Message, Button],
    templateUrl: './category-edit-dialog.component.html',
    styleUrl: './category-edit-dialog.component.scss'
})
export class CategoryEditDialogComponent {
    public readonly categoryControl = new FormControl<string>('', Validators.required);
    public loading = false;
    public category?: ICategory;

    private readonly _categoryService = inject(CategoryService);
    private readonly _dialogService = inject(DialogService);
    private readonly _dialogRef = inject(DynamicDialogRef);
    private readonly _messageService = inject(MessageService);

    constructor() {
        this.category = this._dialogService.getInstance(this._dialogRef).data;

        if (this.category) {
            this.categoryControl.setValue(this.category.name);
        }
    }

    submit() {
        this.loading = true;

        let obs: Observable<ICategory>;
        let message = 'Добавлена новая категория.';

        if (this.category) {
            obs = this._categoryService.update({
                id: this.category!.id,
                name: this.categoryControl.value!
            });
            message = 'Категория сохранена.'
        } else {
            obs = this._categoryService.create({ name: this.categoryControl.value! });
        }
        obs.pipe(
            finalize(() => (this.loading = false)),
            first()
        ).subscribe((category) => {
            this._dialogRef.close(category);
            this._messageService.add({ severity: 'success', summary: 'Успех', detail: message, life: 3000 });
        });
    }

    close() {
        this._dialogRef.close();
    }
}
