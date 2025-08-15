import { Injectable, signal, computed, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  // Signal for sidebar collapsed/expanded state
  private _isCollapsed = signal<boolean>(true);

  // Signal for hover state
  private _isHovered = signal<boolean>(false);

  // Signal for screen size
  private _screenWidth = signal<number>(window.innerWidth);

  constructor() {
    // Listen to window resize events
    const resize$ = fromEvent(window, 'resize').pipe(
      debounceTime(100),
      map(() => window.innerWidth)
    );

    const screenWidthSignal = toSignal(resize$, {
      initialValue: window.innerWidth,
    });

    // Update screen width signal when window resizes
    effect(() => {
      this._screenWidth.set(screenWidthSignal());
    });
  }

  // Computed signal for sidebar visibility
  public isOpen = computed(() => {
    const screenWidth = this._screenWidth();
    const isCollapsed = this._isCollapsed();

    if (screenWidth < 768) {
      // On mobile, sidebar is open when not collapsed
      return !isCollapsed;
    }

    // On desktop, sidebar is always visible (either collapsed or expanded)
    return true;
  });

  // Computed signal for sidebar mode
  public sidebarMode = computed(() => {
    const screenWidth = this._screenWidth();
    return screenWidth < 768 ? 'over' : 'side';
  });

  // Computed signal for sidebar width
  public sidebarWidth = computed(() => {
    const screenWidth = this._screenWidth();
    const isCollapsed = this._isCollapsed();
    const isHovered = this._isHovered();

    if (screenWidth < 768) {
      // On mobile, use full width when expanded, collapsed width when collapsed
      return isCollapsed ? '0px' : '280px';
    }

    // Collapsed width (icons only)
    if (isCollapsed && !isHovered) {
      return '64px';
    }

    // Expanded width (full sidebar)
    return '280px';
  });

  // Computed signal for collapsed state
  public isCollapsed = computed(() => {
    const screenWidth = this._screenWidth();
    const isCollapsed = this._isCollapsed();
    const isHovered = this._isHovered();

    if (screenWidth < 768) {
      // On mobile, always show full content when expanded
      return isCollapsed;
    }

    // On desktop, respect collapsed state unless hovered
    return isCollapsed && !isHovered;
  });

  // Set hover state
  setHovered(isHovered: boolean): void {
    this._isHovered.set(isHovered);
  }

  // Toggle collapsed state
  toggleCollapsed(): void {
    this._isCollapsed.update((current) => !current);
  }

  // Set collapsed state
  setCollapsed(isCollapsed: boolean): void {
    this._isCollapsed.set(isCollapsed);
  }

  // Toggle sidebar
  toggle(): void {
    const screenWidth = this._screenWidth();
    if (screenWidth < 768) {
      // On mobile, simply toggle open/closed
      this._isCollapsed.update((current) => !current);
    } else {
      // On desktop, toggle collapsed/expanded
      this.toggleCollapsed();
    }
  }

  // Open sidebar (expand it)
  open(): void {
    this._isCollapsed.set(false);
  }

  // Close sidebar (collapse it)
  close(): void {
    this._isCollapsed.set(true);
  }
}
