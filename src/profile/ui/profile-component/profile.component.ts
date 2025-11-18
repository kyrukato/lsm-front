import { Component, inject, input, Input, OnInit } from '@angular/core';
import { LucideAngularModule, Home, User, Settings } from 'lucide-angular';
import { DecodeJwtService } from '../../../shared/LocalManager/decode.jwt';
import { AuthApiService } from '../../../auth/infrastructure/auth-api.service';
import { UserResponse } from '../../../auth/infrastructure/models/auth-api.models';
import {
  LocalKeys,
  LocalManagerService,
} from '../../../shared/LocalManager/storage.servicee';

@Component({
  selector: 'app-profile-component',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  readonly HomeIcon = Home;
  readonly UserIcon = User;
  readonly SettingsIcon = Settings;

  _decodeJwtService = inject(DecodeJwtService);
  _AuthApiService = inject(AuthApiService);

  isLoading = true;

  userData: UserResponse = {
    id: '',
    name: '',
    email: '',
    isAcive: false,
    rol: '',
    nickname: '',
  };

  userAvatar = '';

  ngOnInit() {
    const token = LocalManagerService.getElement(LocalKeys.token);
    // console.log(token);
    if (token) {
      this._AuthApiService
        .getUserData(token)
        .subscribe((data: UserResponse) => {
          this.userData = data;
          // obtener primeras letras del nombre y convertirlas a mayúsculas
          const name = this.userData.name.split(' ');
          this.userAvatar = (
            name[0].charAt(0) + name[1].charAt(0)
          ).toUpperCase();
          this.isLoading = false;
        });
    }
  }
}
