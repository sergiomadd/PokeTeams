import { Pipe, PipeTransform } from "@angular/core";
import { environment } from "src/environments/environment";

@Pipe({ name: 'getFlagIconUrl'})

export class GetFlagIconUrlPipe implements PipeTransform
{
  transform(countryCode?: string) : string | undefined
  {
    return countryCode ? `${environment.url}images/flags/${countryCode}.svg` : countryCode;
  }
}