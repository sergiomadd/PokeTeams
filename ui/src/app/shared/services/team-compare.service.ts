import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Move } from 'src/app/core/models/pokemon/move.model';
import { TeamPreviewToCompare } from 'src/app/core/models/team/teamPreviewToCompare.model';

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

  private teamsToCompareSubject$: BehaviorSubject<TeamPreviewToCompare[]> = new BehaviorSubject<TeamPreviewToCompare[]>([])
  teamsToCompare$ = this.teamsToCompareSubject$.asObservable();

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
    updatedValues[index] = value;
    this.teratypeEnabledIndexesB$.next(updatedValues);
  }

  addTeamsToCompare(team: TeamPreviewToCompare)
  {
    const currentValues = this.teamsToCompareSubject$.getValue();
    if(currentValues.length > 1)
    {
      return false;
    }
    const updatedValues = [...currentValues, team];
    this.teamsToCompareSubject$.next(updatedValues);
    return true;
  }

  removeTeamsToCompare(teamId: string)
  {
    const currentValues = this.teamsToCompareSubject$.getValue();
    const indexToRemove = currentValues.findIndex(team => team.teamData.id === teamId);
    if (indexToRemove === -1) 
    {
      return false;
    }
    const updatedValues = 
    [
      ...currentValues.slice(0, indexToRemove),
      ...currentValues.slice(indexToRemove + 1)
    ];
    this.teamsToCompareSubject$.next(updatedValues);
    return true;
  }
}