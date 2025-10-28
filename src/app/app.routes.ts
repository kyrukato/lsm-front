import { Routes } from '@angular/router';
import { LoginComponent } from '../auth/ui/login/login.component';
import { RegisterComponent } from '../auth/ui/register/register.component';
import { HomePageComponent } from '../shared/pages/home-page/home-page.component';
import { DashboardComponent } from '../shared/pages/dashboard/dashboard.component';
import { AuthGuard } from '../auth/application/user/auth.guard';
import { ProfileComponent } from '../profile/ui/profile-component/profile.component';
import { DictionaryComponent } from '../dictionary/ui/dictionary/dictionary.component';
import { RankingsComponent } from '../ranking/ui/rankings/rankings.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'ranking',
        component: RankingsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'dictionary',
        component: DictionaryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'dictionary/:cat',
        loadComponent: () =>
          import('../dictionary/ui/category-page/category-page.component').then(
            (m) => m.CategoryPageComponent
          ),
      },
      {
        path: 'guess',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'local',
            canActivate: [AuthGuard],
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('../guessGame/ui/local/levels/levels.component').then(
                    (m) => m.LevelsComponent
                  ),
              },
              {
                path: 'game/:level',
                loadComponent: () =>
                  import('../guessGame/ui/local/local.component').then(
                    (m) => m.LocalComponent
                  ),
              },
            ],
          },
          {
            path: 'online',
            loadComponent: () =>
              import('../guessGame/ui/pvp/pvp.component').then(
                (m) => m.PvpComponent
              ),
          },
        ],
      },
      {
        path: 'sequence',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'local',
            canActivate: [AuthGuard],
            children: [
              {
                path: '',
                loadComponent: () => 
                  import('../sequenceGame/ui/local/levels/levels.component').then(
                    (m) => m.LevelsComponent
                  ),
              },
              {
                path: 'game/:level',
                loadComponent: () =>
                  import('../sequenceGame/ui/local/local.component').then(
                    (m) => m.LocalComponent
                  ),
              }
            ]
          },
          {
            path: 'online',
            loadComponent: () =>
              import('../sequenceGame/ui/pvp/pvp.component').then(
                (m) => m.PvpComponent
              ),
          },
        ],
      },
      {
        path: 'memory',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'local',
            canActivate: [AuthGuard],
            children: [
              {
                path: '',
                loadComponent: () => 
                  import('../memoryGame/ui/memory-local/levels/levels.component').then(
                    (m) => m.LevelsComponent
                  ),
              },
              {
                path: 'game/:level',
                loadComponent: () =>
                  import('../memoryGame/ui/memory-local/memory-local.component').then(
                    (m) => m.MemoryLocalComponent
                  ),
              }
            ]
          },
          {
            path: 'pvp',
            loadComponent: () =>
              import(
                '../memoryGame/ui/memory-pvp/memory-pvp.component'
              ).then((m) => m.MemoryPvpComponent),
          },
        ],
      },
    ],
  },
];
