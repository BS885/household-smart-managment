import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'homepage',
  imports: [MatIconModule,HeaderComponent,FooterComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {

  constructor(private router: Router) { }
  openModule(navigator:string){
    console.log("openModule",navigator);
    this.router.navigate([navigator]);
  }
}
