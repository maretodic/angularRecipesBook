import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { DropdownDirective } from './dropdown.directive';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { PlaceholderDirective } from './placeholder/placeholder.directive';
import { LoggingService } from '../logging.service';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }

@NgModule({
    declarations: [
        DropdownDirective,
        AlertComponent,
        LoadingSpinnerComponent,
        PlaceholderDirective
    ],
    imports: [
        CommonModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient]
            }
        })
    ],
    exports: [
        CommonModule,
        DropdownDirective,
        AlertComponent,
        LoadingSpinnerComponent,
        PlaceholderDirective,
        TranslateModule
    ],
    entryComponents: [AlertComponent],
    providers: [LoggingService]
})
export class SharedModule {}
