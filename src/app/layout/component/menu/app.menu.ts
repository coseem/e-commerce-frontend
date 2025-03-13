import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `
        <ul class="layout-menu">
            <ng-container *ngFor="let item of model; let i = index">
                <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
                <li *ngIf="item.separator" class="menu-separator"></li>
            </ng-container>
        </ul>
    `
})
export class AppMenu implements OnInit {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Главная', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                items: [
                    {
                        label: 'Заказы',
                        icon: 'pi pi-fw pi-shopping-cart',
                        routerLink: ['/orders'],
                        /*items: [{ label: 'Заказы', icon: 'pi pi-cart-plus' }]*/
                    }
                ]
            },
            {
                items: [
                    {
                        label: 'Товары',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/products']
                        /*items: [
                            { label: 'Управление товарами', icon: 'pi pi-fw pi-inbox', routerLink: ['/products'] },
                            { label: 'Управление категорией', icon: 'pi pi-fw pi-inbox' }
                        ]*/
                    }
                ]
            },
            {
                items: [
                    {
                        label: 'Клиенты',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/clients']
                    }
                ]
            },
            {
                items: [
                    {
                        label: 'Контрагенты',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/counterparties']
                    }
                ]
            },
            {
                items: [
                    {
                        label: 'Отчеты',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/reports'],
                    }
                ]
            },
            {
                items: [
                    {
                        label: 'Настройки',
                        icon: 'pi pi-fw pi-cog',
                        items: [
                            { label: 'Категории', icon: 'pi pi-fw pi-table', routerLink: ['/settings/categories'] },
                            { label: 'Страны', icon: 'pi pi-fw pi-table', routerLink: ['/settings/countries'] },
                            { label: 'Единица измерения', icon: 'pi pi-fw pi-table', routerLink: ['/settings/units'] },
                        ]
                    }
                ]
            },
        ];
    }
}
