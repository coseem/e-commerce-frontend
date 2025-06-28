import { Component, inject } from '@angular/core';
import { CountryService } from '../../../services';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-country',
  imports: [],
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss'
})
export class CountryComponent {
  public readonly countries = rxResource({
    loader: () => this._countryService.getAll()
  });

  private readonly _countryService = inject(CountryService);
}
