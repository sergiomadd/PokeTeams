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

  compareMoveA(newMove?: Move)
  {
    this.moveA$.next(newMove);
  }

  compareMoveB(newMove?: Move)
  {
    this.moveB$.next(newMove);
  }
}