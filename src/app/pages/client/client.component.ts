import { Component, inject } from '@angular/core';
import { CounterpartyService } from '../../services';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-client',
  imports: [],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {
  public readonly clients = rxResource({
    loader: () => this._counterpartyService.getAll()
  });

  private readonly _counterpartyService = inject(CounterpartyService);
}
