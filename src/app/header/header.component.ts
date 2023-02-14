import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy{
  private user_sub!: Subscription
  is_authenticated: boolean = false

  constructor(private data_storage_service: DataStorageService, private auth_service: AuthService){}
  
  ngOnInit(): void {
    this.user_sub = this.auth_service.user.subscribe({next: user => {
      this.is_authenticated = !user ? false : true
    }});
  }

  ngOnDestroy(): void {
    this.user_sub.unsubscribe()
  }

  onSaveData(){
    this.data_storage_service.storeRecipes();
  }

  onFetchData(){
    this.data_storage_service.fetchRecipes().subscribe();
  }

  onLogOut(){
    this.auth_service.logout()
  }
  
}
