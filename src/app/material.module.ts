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
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MAT_DATE_FORMATS } from '@angular/material/core';

/**
 * MATERIAL MODULE
 * - Material components
 */

 export const MY_FORMATS = {
  parse: {
      dateInput: 'DD/MM/YYYY',
  },
  display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MM YYYY',
      dateA11yLabel: 'DD/MM/YYYY',
      monthYearA11yLabel: 'MM YYYY',
  },
};


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
            MatMomentDateModule,
            FlexLayoutModule,
            MatIconModule,
            MatProgressSpinnerModule,
            MatTableModule,
            MatPaginatorModule,
            MatSortModule,
            MatSnackBarModule],
            providers: [
              {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
            ],

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
            MatMomentDateModule,
            FlexLayoutModule,
            MatIconModule,
            MatProgressSpinnerModule,
            MatTableModule,
            MatPaginatorModule,
            MatSortModule,
            MatSnackBarModule],
})
export class MaterialModule { }

