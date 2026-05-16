import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css'
})
export class ConfirmModal {
  @Input() visible: boolean = false;
  @Input() title: string = 'CONFIRMAR ACCIÓN';
  @Input() message: string = '¿Estás seguro de que deseas realizar esta acción?';
  @Input() confirmText: string = 'CONFIRMAR';
  @Input() cancelText: string = 'CANCELAR';
  @Input() type: 'danger' | 'warning' | 'info' = 'warning';

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  confirm() {
    this.onConfirm.emit();
  }

  cancel() {
    this.onCancel.emit();
  }
}
