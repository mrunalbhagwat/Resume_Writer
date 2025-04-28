import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SnackBarData {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  // Default state: hidden, no message, error type
  private snackBarState = new BehaviorSubject<SnackBarData>({
    show: false,
    message: '',
    type: 'error'
  });

  // Observable that components can subscribe to
  public snackBar$ = this.snackBarState.asObservable();

  constructor() { }

  /**
   * Show a success message in the snack bar
   * @param message The message to display
   * @param duration Duration in milliseconds (default: 5000ms)
   */
  showSuccess(message: string, duration: number = 5000): void {
    this.show(message, 'success', duration);
  }

  /**
   * Show an error message in the snack bar
   * @param message The message to display
   * @param duration Duration in milliseconds (default: 5000ms)
   */
  showError(message: string, duration: number = 5000): void {
    this.show(message, 'error', duration);
  }

  /**
   * Show a message in the snack bar
   * @param message The message to display
   * @param type The type of message ('success' or 'error')
   * @param duration Duration in milliseconds (default: 5000ms)
   */
  private show(message: string, type: 'success' | 'error', duration: number = 5000): void {
    // Update the state to show the snack bar
    this.snackBarState.next({
      show: true,
      message,
      type
    });

    // Auto-hide after the specified duration
    setTimeout(() => {
      this.hide();
    }, duration);
  }

  /**
   * Hide the snack bar
   */
  hide(): void {
    // Update the state to hide the snack bar
    this.snackBarState.next({
      ...this.snackBarState.value,
      show: false
    });
  }
}
