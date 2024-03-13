import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContextDropdownModule } from './context-dropdown/context-dropdown.module';
import { Option } from './context-dropdown/model/option';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { imagePath } from './lib/image-path';
import { optionsData } from './lib/options-data';

const materialComponents = [MatMenuModule, MatMenuTrigger, MatButtonModule];
const modules = [CommonModule, ContextDropdownModule];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ...modules, ...materialComponents],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'context-dropdown';
  imagePath = imagePath;
  selectedOptionName = 'Select an option';
  menuTopLeftPosition = { x: 0, y: 0 };

  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger!: MatMenuTrigger;

  get options(): Option[] {
    return optionsData;
  }

  get formattedFileName(): string {
    const fileName = this.imagePath.split('/').pop()?.split('.')[0] || '';
    return `${fileName.charAt(0).toUpperCase() + fileName.slice(1)} -
      ${this.selectedOptionName}`;
  }

  /**
   * Method called when the user click with the right button
   * @param event MouseEvent, it contains the coordinates
   * @param item Our data contained in the row of the table
   */
  onRightClick(event: MouseEvent): void {
    event.preventDefault();

    this.menuTopLeftPosition.x = event.clientX;
    this.menuTopLeftPosition.y = event.clientY;

    this.matMenuTrigger.menuData = { menuOptions: this.options };

    this.matMenuTrigger.openMenu();
  }

  setSelectedOption(selectedOption: Option): void {
    this.imagePath = `assets/${selectedOption.type.toLowerCase()}.webp`;
    this.selectedOptionName = selectedOption.name;
  }
}
