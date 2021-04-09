import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FlexLayoutModule } from '@angular/flex-layout';

/**
 * MATERIAL MODULE
 * - Material components
 */

@NgModule({
  imports: [MatButtonModule,
          MatCheckboxModule,
            MatCardModule,
            MatInputModule,
            MatRadioModule,
            MatSelectModule,
            MatCheckboxModule,
            MatSliderModule,
            MatAutocompleteModule,
            MatDialogModule,
            MatSidenavModule,
            MatTabsModule,
            MatDatepickerModule,
            FlexLayoutModule,
            MatIconModule,
            MatProgressSpinnerModule],

  exports: [MatButtonModule,
            MatCheckboxModule,
            MatCardModule,
            MatInputModule,
            MatRadioModule,
            MatSelectModule,
            MatCheckboxModule,
            MatSliderModule,
            MatAutocompleteModule,
            MatDialogModule,
            MatSidenavModule,
            MatTabsModule,
            MatDatepickerModule,
            FlexLayoutModule,
            MatIconModule,
            MatProgressSpinnerModule],
})
export class MaterialModule { }

