import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public static howManySimulations: number = 2000;

  constructor() { }
}
