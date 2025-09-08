import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  private locationHistory: string[] = [];

  constructor(private router: Router) {}

  public GetHistory(): string[] {
    return this.locationHistory;
  }

  public ResetHistory(): string {
    this.locationHistory = [];
    return '';
  }

  public PushRoute(route: any[]): void {
    this.router.navigate(route);
    return;
  }

  public PopRoute(): string {
    while (
      this.locationHistory.length &&
      this.locationHistory[this.locationHistory.length - 1] === '/' + 'login'
    ) {
      this.locationHistory.pop();
    }
    const location = this.locationHistory.pop() || '';
    return location;
  }
}
