import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Input() discussionTitle: string | null = null;
  @Input() sidebarVisible = true;
  @Output() toggleSidebarEvent = new EventEmitter<void>();
}
