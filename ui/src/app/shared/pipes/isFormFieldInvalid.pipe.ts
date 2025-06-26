import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'isFormFieldInvalid'})

export class IsFormFieldInvalidPipe implements PipeTransform
{
  constructor() {}

  transform(errors: any, dirty: boolean, touched: boolean, submitted: boolean) : boolean
  {
    return errors && (dirty || touched || submitted);
  }
}