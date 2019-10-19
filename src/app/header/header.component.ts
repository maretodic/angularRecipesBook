import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy{
    private userSub: Subscription;
    isAuth = false;
    isCollapsed = true;
    public currentLang: string;

    constructor(private dataStorageService: DataStorageService,
                private authService: AuthService,
                public translate: TranslateService,
                private _changeDetRef: ChangeDetectorRef) {
                    this.currentLang = this.translate.currentLang;

                    translate.onLangChange.subscribe((event: LangChangeEvent) => {
                        this.currentLang = event.lang;
                        this._changeDetRef.detectChanges();
                    })
                }

    ngOnInit() {
       this.userSub = this.authService.user.subscribe(user => {
            this.isAuth = !!user;
       });
    }
    
    onSaveData() {
        this.dataStorageService.storeRecipes();
    }


    onFetchData() {
        this.dataStorageService.getRecipes().subscribe();
    }

    onLogOut() {
        this.authService.logOut();
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }

    changeLang(value: string) {
        this.translate.use('sr');
    }
}
