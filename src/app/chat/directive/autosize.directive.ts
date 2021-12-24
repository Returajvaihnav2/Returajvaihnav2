// Usage example: <textarea autoresize></textarea>

import { ElementRef, HostListener, Directive, AfterContentChecked } from '@angular/core';

@Directive({
    selector: 'textarea[autosize]'
})

export class AutosizeDirective implements AfterContentChecked {
    @HostListener('input', ['$event.target'])
    onInput(textArea: HTMLTextAreaElement): void {
        this.adjust();
    }
    constructor(public element: ElementRef) {
    }
    ngAfterContentChecked(): void {
        this.adjust();
    }
    adjust(): void {
        const element = this.element.nativeElement;
        const parent = element.parentNode;
        const previous = parent.previousElementSibling;
        const maxsize = 80;
        const bottompadding = 1;
        const previousbozsize = 320;
        if (element.scrollHeight <= maxsize) {
            element.style.overflow = 'hidden';
            element.style.height = 'auto';
            element.style.height = (element.scrollHeight - bottompadding) + 'px';
            parent.style.height = (element.scrollHeight - bottompadding) + 'px';
            previous.style.height = (previousbozsize - element.scrollHeight) + 'px';
        } else {
            element.style.overflow = 'auto';
            element.style.height = maxsize + 'px';
            parent.style.height = maxsize + 'px';
            previous.style.height = (previousbozsize - maxsize) + 'px';
        }
    }
}
