import { Component, inject } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { NgIf } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';
import { ProgressSpinner } from 'primeng/progressspinner';
import { DialogService } from 'primeng/dynamicdialog';
import { CategoryEditDialogComponent } from './category-edit-dialog/category-edit-dialog.component';
import { ICategory } from '../../../interfaces/category.interface';
import { first, take } from 'rxjs';
import { Toast } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'app-category',
    imports: [TableModule, Button, Toolbar, ProgressSpinner, NgIf, Toast, ConfirmPopupModule],
    providers: [DialogService, ConfirmationService],
    templateUrl: './category.component.html',
    styleUrl: './category.component.scss'
})
export class CategoryComponent {
    public categories = rxResource({
        loader: () => this.categoryService.getAll()
    });
    private categoryService = inject(CategoryService);
    private dialogService = inject(DialogService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    openCategoryDialog(category?: ICategory) {
        this.dialogService
            .open(CategoryEditDialogComponent, {
                header: category ? 'Изменить категорию' : 'Добавить категорию',
                modal: true,
                closable: true,
                focusOnShow: false,
                data: category,
                style: { width: '350px' },
                breakpoints: {
                    '576px': '320px'
                }
            })
            .onClose.pipe(take(1))
            .subscribe((r: ICategory) => {
                if (!r) return;
                this.categories.value.update((values) => {
                    if (category) {
                        const getCategoryIndex = values?.findIndex((i) => i.id === r.id) ?? -1;

                        if (getCategoryIndex !== -1) {
                            values![getCategoryIndex] = r;
                        }

                        return values;
                    }
                    return [...values!, r];
                });
            });
    }

  remove(event: Event, category: ICategory) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Вы хотите удалить эту запись?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Отмена',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Удалить',
        severity: 'danger'
      },
      accept: () => {
        this.categoryService.remove(category.id!)
          .pipe(first())
          .subscribe(() => {
            this.categories.value.update(values => {
              return values?.filter((i) => i.id !== category.id);
            });
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Запись удалена', life: 3000 });
          })
      },
    });
  }
}
