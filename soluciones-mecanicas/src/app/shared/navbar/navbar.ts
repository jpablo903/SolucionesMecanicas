import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { User } from '../../features/dashboard/dashboard.models';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isLoggedIn = false;
  currentUser: User | null = null;
  isMobileMenuOpen = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });

    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  get dashboardLink(): string {
    return this.currentUser?.role === 'admin' ? '/admin' : '/dashboard';
  }

  logout() {
    this.authService.logout();
    window.location.href = '/';
  }
}
