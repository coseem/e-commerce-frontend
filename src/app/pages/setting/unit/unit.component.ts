import { Component, inject } from '@angular/core';
import { UnitService } from '../../../services';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-unit',
  imports: [],
  templateUrl: './unit.component.html',
  styleUrl: './unit.component.scss'
})
export class UnitComponent {
  public readonly units = rxResource({
    loader: () => this._unitService.getAll()
  });

  private readonly _unitService = inject(UnitService);
}
