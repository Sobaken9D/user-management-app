import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  userId: number | null = null;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      website: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId = Number(id);
      this.isEditMode = true;
      
      // Ищем сначала в локальном списке сервиса
      const userFromList = this.userService.getUsersSnapshot().find(u => u.id === this.userId);
      
      if (userFromList) {
        this.userForm.patchValue(userFromList);
      } else {
        // Если нет в списке, делаем запрос к API
        this.userService.getUser(this.userId).subscribe(user => {
          this.userForm.patchValue(user);
        }, error => {
          console.error('Пользователь не найден', error);
        });
      }
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = { ...this.userForm.value, id: this.userId };
      if (this.isEditMode) {
        this.userService.updateUser(userData).subscribe(() => {
          this.router.navigate(['/users']);
        });
      } else {
        this.userService.createUser(userData).subscribe(() => {
          this.router.navigate(['/users']);
        });
      }
    }
  }
}
