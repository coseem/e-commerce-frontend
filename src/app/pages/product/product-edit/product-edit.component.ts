import { Component, HostListener, inject, input, OnInit, signal } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ProductService } from '../../../services';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { Divider } from 'primeng/divider';
import { first, take } from 'rxjs';
import { cleanObject } from '../../../operators';
import { CategoryService } from '../../../services';
import { rxResource } from '@angular/core/rxjs-interop';
import { CategoryEditDialogComponent } from '../../setting/category/category-edit-dialog/category-edit-dialog.component';
import { ICategory, ICountry, IProduct } from '../../../interfaces';
import { DialogService } from 'primeng/dynamicdialog';
import { CountryService } from '../../../services';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { UnitService } from '../../../services';

@Component({
    selector: 'app-product-edit',
    imports: [InputText, TextareaModule, FormsModule, ReactiveFormsModule, Button, Select, Divider, AutoCompleteModule],
    templateUrl: './product-edit.component.html',
    styleUrl: './product-edit.component.scss',
    providers: [ProductService, DialogService]
})
export class ProductEditComponent implements OnInit {
    public readonly id = input<string>();
    public readonly form = new FormGroup({
        id: new FormControl<string | null>(null),
        name: new FormControl<string | null>(null, [Validators.required]),
        barcode: new FormControl<string | null>(null),
        sku: new FormControl<string | null>(null),
        category: new FormControl<string | null>(null),
        purchasePrice: new FormControl<number | null>(null),
        salePrice: new FormControl<number | null>(null),
        description: new FormControl<string | null>(null),
        country: new FormControl<string | null>(null),
        counterparty: new FormControl<string | null>(null),
        unit: new FormControl<string | null>(null),
        weight: new FormControl<number>(0),
        volume: new FormControl<number>(0)
    });

    public readonly categories = rxResource({
        loader: () => this._categoryService.getAll()
    });

    public readonly units = rxResource({
        loader: () => this._unitService.getAll()
    });

    public countries: ICountry[] = [];
    public filteredCountries: ICountry[] = [];

    private readonly _buffer = signal<string>('');
    private readonly _lastKeyTime = signal<number>(0);

    private readonly _productService = inject(ProductService);
    private readonly _categoryService = inject(CategoryService);
    private readonly _countryService = inject(CountryService);
    private readonly _unitService = inject(UnitService);
    private readonly _dialogService = inject(DialogService);
    private readonly _messageService = inject(MessageService);
    private readonly _router = inject(Router);

    ngOnInit() {
        this._getProduct();
        this._getCountry();
    }

    submit() {
        const formData = cleanObject(this.form.value) as IProduct;
        this._productService
            .create(formData)
            .pipe(first())
            .subscribe((product) => {
                this._messageService.add({
                    severity: 'success',
                    summary: 'Успех',
                    detail: 'Товар успешно добавлен.',
                    life: 3000
                });
                this._router.navigate(['/products']).then();
            });
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent): void {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - this._lastKeyTime();

        if (timeDiff < 100) {
            this._buffer.set(this._buffer() + event.key);
        } else {
            this._buffer.set(event.key);
        }

        this._lastKeyTime.set(currentTime);

        if (event.key === 'Enter' || this._buffer().endsWith('Ente')) {
            this._processBuffer();
        }
    }

    addCategory() {
        this._dialogService
            .open(CategoryEditDialogComponent, {
                header: 'Добавить категорию',
                modal: true,
                closable: true,
                focusOnShow: false,
                style: { width: '350px' },
                breakpoints: {
                    '576px': '320px'
                }
            })
            .onClose.pipe(take(1))
            .subscribe((r: ICategory) => {
                if (!r) return;
                this.categories.value.update((values) => [...values!, r]);
                this.form.get('category')?.setValue(r.id?.toString() || null);
            });
    }

    searchCountry(e: AutoCompleteCompleteEvent) {
        this.filteredCountries = this.countries.filter((i) => i.name.toLowerCase().includes(e.query.toLowerCase()));
    }

    private _processBuffer(): void {
        this.form.get('barcode')?.setValue(this._buffer().replace(/Ente?r?$/, ''));
        this._buffer.set('');
    }

    private _getProduct() {
        if (this.id() === 'new') return;

        this._productService
            .getOne(this.id()!)
            .pipe(first())
            .subscribe((products) => {
                if (products && products.length > 0) {
                    this.form.patchValue(products[0]);
                }
            });
    }

    private _getCountry() {
        this._countryService
            .getAll()
            .pipe(first())
            .subscribe((countries) => {
                this.countries = this.filteredCountries = countries;
            });
    }
}
