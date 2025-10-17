import { Pipe, PipeTransform } from "@angular/core";
import { UtilService } from "src/app/core/helpers/util.service";

@Pipe({
    name: 'getFormControlError',
    standalone: false
})

export class GetFormControlErrorPipe implements PipeTransform
{
  constructor(private util: UtilService) {}

  transform(errors: any) : string
  {
    if(errors)
    {
      return this.util.getAuthFormErrors(errors);
    }
    return "";
  }
}