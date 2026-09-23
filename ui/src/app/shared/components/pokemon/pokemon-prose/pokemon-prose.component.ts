import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProcessedString } from '../../../../core/models/misc/processedString.model';

@Component({
    selector: 'app-pokemon-prose',
    templateUrl: './pokemon-prose.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonProseComponent
{
  readonly chunks = input<ProcessedString[]>([]);
  readonly iconClass = input<string>('icon-s');
}
