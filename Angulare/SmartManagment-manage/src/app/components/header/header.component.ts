import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/Auth/auth.actions';
import { AppState } from '../../store/app.state';
@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  ngOnInit(): void {
    this.store.select(state => state.auth)
      .subscribe(auth => {
        console.log('auth', auth);
        
        this.username = auth?.user?.name ?? '';
      });
  }

  logout():void{

  }
  username: string;
  constructor(private store: Store<AppState>) { }
}
