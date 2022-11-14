import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {GlobalService} from "../../global/global.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.css']
})
export class SettingsModalComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<void>();

  simulationDepth: number = 0;

  constructor(public globalService: GlobalService, public router: Router) { }

  closeModal() {
    this.closeEvent.emit();
  }

  ngOnInit(): void {
    this.simulationDepth = GlobalService.howManySimulations;
  }

  updateGlobal(){
    GlobalService.howManySimulations = this.simulationDepth;
    console.log(GlobalService.howManySimulations);
  }

  goHome() {
    this.router.navigate(['']);
  }
}
