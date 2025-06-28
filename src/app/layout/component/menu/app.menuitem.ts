import { Component, HostBinding, Input, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../../service/layout.service';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[app-menuitem]',
    imports: [CommonModule, RouterModule, RippleModule],
    template: `
        @if ((!item.routerLink || item.items) && item.visible !== false) {
            <a [attr.href]="item.url" (click)="itemClick($event)" [ngClass]="item.styleClass" [attr.target]="item.target" tabindex="0" pRipple>
                <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
                <span class="layout-menuitem-text">{{ item.label }}</span>
                @if (item.items) {
                    <i class="pi pi-fw pi-angle-down layout-submenu-toggler"></i>
                }
            </a>
        } @else if (item.routerLink && !item.items && item.visible !== false) {
            <a (click)="itemClick($event)"
               [ngClass]="item.styleClass"
               [routerLink]="item.routerLink"
               routerLinkActive="active-route"
               [routerLinkActiveOptions]="item.routerLinkActiveOptions || { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' }"
               [fragment]="item.fragment"
               [queryParamsHandling]="item.queryParamsHandling"
               [preserveFragment]="item.preserveFragment"
               [skipLocationChange]="item.skipLocationChange"
               [replaceUrl]="item.replaceUrl"
               [state]="item.state"
               [queryParams]="item.queryParams"
               [attr.target]="item.target"
               tabindex="0"
               pRipple>
                <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
                <span class="layout-menuitem-text">{{ item.label }}</span>
            </a>
        }

        @if (item.items && item.visible !== false) {
            <ul [@children]="submenuAnimation">
                @for (child of item.items; track child; let i = $index) {
                    <li app-menuitem [item]="child" [index]="i" [parentKey]="key" [class]="child['badgeClass']"></li>
                }
            </ul>
        }
    `,
    animations: [
        trigger('children', [
            state(
                'collapsed',
                style({
                    height: '0'
                })
            ),
            state(
                'expanded',
                style({
                    height: '*'
                })
            ),
            transition('collapsed <=> expanded', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ],
    providers: [LayoutService]
})
export class AppMenuitem implements OnInit, OnDestroy {
    @Input() item!: MenuItem;
    @Input() index!: number;
    @Input() @HostBinding('class.layout-root-menuitem') root!: boolean;
    @Input() parentKey!: string;

    public active = false;
    public key: string = '';

    private readonly _router = inject(Router);
    private readonly _layoutService = inject(LayoutService);
    private readonly _menuSourceSubscription: Subscription;
    private readonly _menuResetSubscription: Subscription;

    constructor() {
        this._menuSourceSubscription = this._layoutService.menuSource$.subscribe((value) => {
            Promise.resolve(null).then(() => {
                if (value.routeEvent) {
                    this.active = value.key === this.key || value.key.startsWith(this.key + '-') ? true : false;
                } else {
                    if (value.key !== this.key && !value.key.startsWith(this.key + '-')) {
                        this.active = false;
                    }
                }
            });
        });

        this._menuResetSubscription = this._layoutService.resetSource$.subscribe(() => {
            this.active = false;
        });

        this._router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((params) => {
            if (this.item.routerLink) {
                this._updateActiveStateFromRoute();
            }
        });
    }

    ngOnInit() {
        this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index);

        if (this.item.routerLink) {
            this._updateActiveStateFromRoute();
        }
    }

    private _updateActiveStateFromRoute() {
        let activeRoute = this._router.isActive(this.item.routerLink[0], { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' });

        if (activeRoute) {
            this._layoutService.onMenuStateChange({ key: this.key, routeEvent: true });
        }
    }

    itemClick(event: Event) {
        // avoid processing disabled items
        if (this.item.disabled) {
            event.preventDefault();
            return;
        }

        // execute command
        if (this.item.command) {
            this.item.command({ originalEvent: event, item: this.item });
        }

        // toggle active state
        if (this.item.items) {
            this.active = !this.active;
        }

        this._layoutService.onMenuStateChange({ key: this.key });
    }

    get submenuAnimation() {
        return this.root ? 'expanded' : this.active ? 'expanded' : 'collapsed';
    }

    @HostBinding('class.active-menuitem')
    get activeClass() {
        return this.active && !this.root;
    }

    ngOnDestroy() {
        if (this._menuSourceSubscription) {
            this._menuSourceSubscription.unsubscribe();
        }

        if (this._menuResetSubscription) {
            this._menuResetSubscription.unsubscribe();
        }
    }
}
