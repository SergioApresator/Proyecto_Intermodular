import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-diario',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './diario.html',
  styleUrl: './diario.css',
})

export class Diario {

}