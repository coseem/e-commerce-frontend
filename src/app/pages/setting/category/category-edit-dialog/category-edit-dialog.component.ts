import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../../services/category.service';
import { finalize, first, Observable } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ICategory } from '../../../../interfaces/category.interface';
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
    public categoryControl = new FormControl<string>('', Validators.required);
    public loading = false;
    public category?: ICategory;
    private categoryService = inject(CategoryService);
    private dialogService = inject(DialogService);
    private dialogRef = inject(DynamicDialogRef);
    private messageService = inject(MessageService);

    constructor() {
        this.category = this.dialogService.getInstance(this.dialogRef).data;

        if (this.category) {
            this.categoryControl.setValue(this.category.name);
        }
    }

    submit() {
        this.loading = true;

        let obs: Observable<ICategory>;
        let message = 'Добавлена новая категория.';

        if (this.category) {
            obs = this.categoryService.update({
                id: this.category!.id,
                name: this.categoryControl.value!
            });
            message = 'Категория сохранена.'
        } else {
            obs = this.categoryService.create({ name: this.categoryControl.value! });
        }
        obs.pipe(
            finalize(() => (this.loading = false)),
            first()
        ).subscribe((category) => {
            this.dialogRef.close(category);
            this.messageService.add({ severity: 'success', summary: 'Успех', detail: message, life: 3000 });
        });
    }

    close() {
        this.dialogRef.close();
    }
}
