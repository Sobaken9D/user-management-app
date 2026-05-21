import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzInputModule, NzButtonModule, NzDividerModule, RouterLink, FormsModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  loading: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.users$.subscribe(users => {
      this.users = users;
      this.filterUsers();
      this.loading = false;
    });
    
    if (this.users.length === 0) {
      this.loading = true;
      this.userService.loadUsers();
    }
  }

  filterUsers(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user => 
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }
  
  deleteUser(id: number): void {
      this.userService.deleteUser(id).subscribe();
  }
}
