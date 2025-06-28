import { Component, OnInit, signal } from '@angular/core';
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
            @for (item of model(); track item; let i = $index) {
                @if (!item.separator) {
                    <li app-menuitem [item]="item" [index]="i" [root]="true"></li>
                } @else {
                    <li class="menu-separator"></li>
                }
            }
        </ul>
    `
})
export class AppMenu implements OnInit {
    public readonly model = signal<MenuItem[]>([]);

    ngOnInit() {
        this.model.set([
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
        ]);
    }
}
