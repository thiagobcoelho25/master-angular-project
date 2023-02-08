import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  isOpen = false

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  @HostListener('click', ['$event.target']) toggleMenu() {
    const dropdown = this.elementRef.nativeElement.nextElementSibling;

    if (!this.isOpen) {
      this.renderer.addClass(dropdown, 'show');
    } else {
      this.renderer.removeClass(dropdown, 'show');
    }
    this.isOpen = !this.isOpen
  }

  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    const dropdown = this.elementRef.nativeElement.nextElementSibling;
    if (event.target !== this.elementRef.nativeElement) {
      this.isOpen = false;
      this.renderer.removeClass(dropdown, 'show');
    }
  }
}

