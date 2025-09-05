import { Component, ElementRef, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-rich-text-control',
  standalone: true,
  templateUrl: './rich-text-control.html',
  styleUrl: './rich-text-control.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextControl),
      multi: true,
    },
  ],
})
export class RichTextControl implements ControlValueAccessor {
  @ViewChild('editor', { static: true }) editor!: ElementRef<HTMLDivElement>;

  value = `
    <p>Hi [Candidate's Name],</p>
    <p>We're excited to offer you the [Position Title] role at [Company Name]!</p>

    <p><strong>Start Date:</strong> [Start Date]<br>
    <strong>Salary:</strong> [Amount]<br>
    <strong>Location:</strong> [Remote / Office / Hybrid]<br>
    <strong>Schedule:</strong> [e.g., Full-time]</p>

    <p>Please confirm your acceptance by replying to this email or signing the attached offer letter by [Deadline].</p>
    <p>We can't wait to have you on the team!</p>

    <p>Best,<br>
    [Your Name]<br>
    [Your Position]<br>
    [Company Name]</p>
  `;
  disabled = false;
  codeView = false;

  private onChangeFn: (value: any) => void = () => { };
  private onTouchedFn: () => void = () => { };

  onInput(event: Event): void {
    this.value = (event.target as HTMLElement).innerHTML;
    this.onChangeFn(this.value);
    this.onTouchedFn();
  }

  format(command: string, value: any = null): void {
    document.execCommand(command, false, value);
    this.value = this.editor.nativeElement.innerHTML;
    this.onChangeFn(this.value);
  }

  insertLink(): void {
    const url = prompt('Enter the link URL:', 'https://');
    if (url) {
      this.format('createLink', url);
    }
  }

  insertImage(): void {
    const url = prompt('Enter image URL:', 'https://');
    if (url) {
      this.format('insertImage', url);
    }
  }

  onFontSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    if (select?.value) {
      this.format('fontSize', select.value);
    }
  }

  onColorChange(event: Event, command: string): void {
    const input = event.target as HTMLInputElement;
    if (input?.value) {
      this.format(command, input.value);
    }
  }

  toggleCode(): void {
    this.codeView = !this.codeView;
    if (this.codeView) {
      this.editor.nativeElement.innerText = this.value; // raw HTML
    } else {
      this.editor.nativeElement.innerHTML = this.value; // rendered
    }
  }

  // ControlValueAccessor
  writeValue(value: any): void {
    this.value = value || '';
    if (this.editor) {
      this.editor.nativeElement.innerHTML = this.value;
    }
  }
  registerOnChange(fn: any): void { this.onChangeFn = fn; }
  registerOnTouched(fn: any): void { this.onTouchedFn = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }
}
