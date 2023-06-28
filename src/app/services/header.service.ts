import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private isHeaderVisible = true;

  constructor() {}

  setHeaderEnabled(enabled: boolean): void {
    this.isHeaderVisible = enabled;
  }

  isHeaderEnabled(): boolean {
    return this.isHeaderVisible;
  }
}
