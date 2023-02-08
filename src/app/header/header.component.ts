import { Component, EventEmitter, Output } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private data_storage_service: DataStorageService){}

  onSaveData(){
    this.data_storage_service.storeRecipes();
  }

  onFetchData(){
    this.data_storage_service.fetchRecipes().subscribe();
  }
}
