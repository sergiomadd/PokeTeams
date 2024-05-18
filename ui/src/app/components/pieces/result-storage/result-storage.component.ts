import { Component } from '@angular/core';
import { QueryResultDTO } from 'src/app/models/DTOs/queryResult.dto';

@Component({
  selector: 'app-result-storage',
  templateUrl: './result-storage.component.html',
  styleUrl: './result-storage.component.scss'
})
export class ResultStorageComponent 
{
  results: QueryResultDTO[] = [];

  remove(index: number)
  {
    this.results.splice(index, 1);
  }
}
