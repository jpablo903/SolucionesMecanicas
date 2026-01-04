import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isLoggedIn = false;
  userEmail = '';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });

    this.authService.currentUserEmail$.subscribe((email: string) => {
      this.userEmail = email;
    });
  }

  logout() {
    this.authService.logout();
    window.location.href = '/';
  }
}
