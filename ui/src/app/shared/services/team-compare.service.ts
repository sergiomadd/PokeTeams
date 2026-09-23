import { Injectable, signal } from '@angular/core';
import { Move } from '../../core/models/pokemon/move.model';
import { TeamPreviewToCompare } from '../../core/models/team/teamPreviewToCompare.model';

@Injectable({
  providedIn: 'root'
})
export class TeamCompareService
{
  selectedMoveA = signal<Move | undefined>(undefined);
  selectedMoveB = signal<Move | undefined>(undefined);

  teratypeEnabledIndexesA = signal<boolean[]>([]);
  teratypeEnabledIndexesB = signal<boolean[]>([]);

  teamsToCompare = signal<TeamPreviewToCompare[]>([]);

  setMoveA(newMove?: Move)
  {
    this.selectedMoveA.set(newMove);
  }

  setMoveB(newMove?: Move)
  {
    this.selectedMoveB.set(newMove);
  }

  setTeratypeSelectedIndexA(index: number, value: boolean)
  {
    this.teratypeEnabledIndexesA.update(current =>
    {
      const updatedValues = [...current];
      updatedValues[index] = value;
      return updatedValues;
    });
  }

  setTeratypeSelectedIndexB(index: number, value: boolean)
  {
    this.teratypeEnabledIndexesB.update(current =>
    {
      const updatedValues = [...current];
      updatedValues[index] = value;
      return updatedValues;
    });
  }

  addTeamsToCompare(team: TeamPreviewToCompare)
  {
    if(this.teamsToCompare().length > 1)
    {
      return false;
    }
    this.teamsToCompare.update(current => [...current, team]);
    return true;
  }

  removeTeamsToCompare(teamId: string)
  {
    const currentValues = this.teamsToCompare();
    const indexToRemove = currentValues.findIndex(team => team.teamData.id === teamId);
    if (indexToRemove === -1)
    {
      return false;
    }
    this.teamsToCompare.update(current =>
    [
      ...current.slice(0, indexToRemove),
      ...current.slice(indexToRemove + 1)
    ]);
    return true;
  }
}
