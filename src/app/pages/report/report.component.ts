import { Component, inject } from '@angular/core';
import { signal } from '@angular/core';

@Component({
  selector: 'app-report',
  imports: [],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent {
  public readonly reports = signal<any[]>([]);
  public readonly loading = signal(false);

  // TODO: Add report service when available
  // private readonly _reportService = inject(ReportService);
}
