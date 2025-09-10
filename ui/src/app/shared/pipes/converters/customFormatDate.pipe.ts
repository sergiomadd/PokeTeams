import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'customFormatDate'})

export class CustomFormatDatePipe implements PipeTransform
{
  transform(date?: string) : string | undefined
  {
    //Format from backend YYYY-MM-DD
    if(date)
    {
      const day = date.split('-')[2];
      const month = date.split('-')[1];
      const year = date.split('-')[0];
      return [day, month, year].join('/');
    }
    return date;
  }
}