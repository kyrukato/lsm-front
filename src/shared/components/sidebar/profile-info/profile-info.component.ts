import { AuthApiService } from './../../../../auth/infrastructure/auth-api.service';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { LucideAngularModule, Settings } from 'lucide-angular';
import { DecodeJwtService } from '../../../LocalManager/decode.jwt';
import { UserResponse } from '../../../../auth/infrastructure/models/auth-api.models';
import {
  LocalKeys,
  LocalManagerService,
} from '../../../LocalManager/storage.servicee';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css'],
  imports: [LucideAngularModule],
  standalone: true,
})
export class ProfileInfoComponent implements OnInit {
  _decodeJwtService = inject(DecodeJwtService);
  _AuthApiService = inject(AuthApiService);

  readonly SettingsIcon = Settings;

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
    if (token) {
      // console.log(this._decodeJwtService.decodeId(token));
      this._AuthApiService
        .getUserData(token)
        .subscribe((data: UserResponse) => {
          this.userData = data;
          // obtener primeras letras del nombre y convertirlas a mayúsculas
          const name = this.userData.name.split(' ');
          this.userAvatar = (
            name[0].charAt(0) + name[0].charAt(1)
          ).toUpperCase();
          this.isLoading = false;
        });
    }
  }
}
