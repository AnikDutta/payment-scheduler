import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoaderService } from './_services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  private subscription: Subscription;
  loading: boolean = false;
 constructor(private loaderService: LoaderService){
   
 }
  title = 'payment-scheduler';

  ngOnInit(){
    this.subscription = this.loaderService.getMessage().subscribe(loading => { 
            setTimeout(()=>{
              this.loading = loading; 
            },0);
        });
  }
  ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
