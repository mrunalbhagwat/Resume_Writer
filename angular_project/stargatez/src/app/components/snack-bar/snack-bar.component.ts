import { Component, OnInit, OnDestroy } from '@angular/core';
import { SnackBarService } from '../../services/snack-bar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.scss'
})
export class SnackBarComponent implements OnInit, OnDestroy {
  show: boolean = false;
  message: string = '';
  type: 'success' | 'error' = 'error';
  private subscription: Subscription = new Subscription();

  constructor(private snackBarService: SnackBarService) {}

  ngOnInit(): void {
    // Subscribe to the snack bar state
    this.subscription = this.snackBarService.snackBar$.subscribe(state => {
      this.show = state.show;
      this.message = state.message;
      this.type = state.type;
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Close the snack bar
   */
  close(): void {
    this.snackBarService.hide();
  }
}
