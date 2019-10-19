import { Directive, HostListener, HostBinding, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.show') isOpen: boolean = false;

  @HostListener('document:click', ['$event']) toggleDropdown(event: Event) {
    const element = this.elRef.nativeElement;
    const dropdownMenu = this.elRef.nativeElement.nextSibling;
    // console.log({dropdownMenu})
    if(element.contains(event.target)){
      if(this.isOpen) {
        this.renderer.removeClass(dropdownMenu, 'show');
      } else {
        this.renderer.addClass(dropdownMenu, 'show');  
      }
      this.isOpen = !this.isOpen;
      
    } else {
      this.isOpen = false;
      this.renderer.removeClass(dropdownMenu, 'show');
    }
  }

  constructor(private elRef: ElementRef, private renderer: Renderer2) { }

}