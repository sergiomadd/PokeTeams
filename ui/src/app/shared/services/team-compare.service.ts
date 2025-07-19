import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Move } from 'src/app/core/models/pokemon/move.model';

@Injectable({
  providedIn: 'root'
})
export class TeamCompareService 
{
  private moveA$: BehaviorSubject<Move | undefined> = new BehaviorSubject<Move | undefined>(undefined)
  selectedMoveA$ = this.moveA$.asObservable();

  private moveB$: BehaviorSubject<Move | undefined> = new BehaviorSubject<Move | undefined>(undefined)
  selectedMoveB$ = this.moveB$.asObservable();

  private teratypeEnabledIndexesA$: BehaviorSubject<boolean[]> = new BehaviorSubject<boolean[]>([])
  teratypeEnabledIndexesAObservable$ = this.teratypeEnabledIndexesA$.asObservable();

  private teratypeEnabledIndexesB$: BehaviorSubject<boolean[]> = new BehaviorSubject<boolean[]>([])
  teratypeEnabledIndexesBObservable$ = this.teratypeEnabledIndexesA$.asObservable();


  setMoveA(newMove?: Move)
  {
    this.moveA$.next(newMove);
  }

  setMoveB(newMove?: Move)
  {
    this.moveB$.next(newMove);
  }

  setTeratypeSelectedIndexA(index: number, value: boolean)
  {
    const currentValues = this.teratypeEnabledIndexesA$.getValue();
    const updatedValues = [...currentValues];
    updatedValues[index] = value;
    this.teratypeEnabledIndexesA$.next(updatedValues);
  }

  setTeratypeSelectedIndexB(index: number, value: boolean)
  {
    const currentValues = this.teratypeEnabledIndexesB$.getValue();
    const updatedValues = [...currentValues];
    updatedValues[index] = true;
    this.teratypeEnabledIndexesB$.next(updatedValues);
  }
}