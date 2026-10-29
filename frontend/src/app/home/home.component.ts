import { Component, HostListener, inject, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ChatComponent } from '../chat/chat.component';
import { HeaderComponent } from '../header/header.component';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, ChatComponent, HeaderComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  sidebarVisible = true;
  screenWidth = window.innerWidth;
  private chat = inject(ChatService);
  readonly title = this.chat.activeTitle;

  @HostListener('window:resize')
  onResize(): void {
    this.screenWidth = window.innerWidth;
  }

  isMobile(): boolean {
    return this.screenWidth < 768;
  }

  ngOnInit() {
    if (this.isMobile()) this.sidebarVisible = false;
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  closeSidebarOnMobile(): void {
    if (this.isMobile()) this.sidebarVisible = false;
  }
}
