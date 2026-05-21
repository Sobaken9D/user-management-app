import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NzCardModule, NzButtonModule],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss',
})
export class UserDetailComponent implements OnInit {
  user: User | undefined;

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    // Подписываемся на поток пользователей из сервиса
    this.userService.users$.subscribe(users => {
      this.user = users.find(u => u.id === id);
      
      // Если пользователя нет в кэше (например, при прямом переходе по ссылке),
      // загружаем его отдельно
      if (!this.user) {
        this.userService.getUser(id).subscribe(u => this.user = u);
      }
    });
  }
}
