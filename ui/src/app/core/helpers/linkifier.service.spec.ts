import { TestBed } from '@angular/core/testing';

import { ProcessedString } from '../models/misc/processedString.model';
import { LinkifierService } from './linkifier.service';

describe('LinkifierService', () => {
  let service: LinkifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinkifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('linkifyProse()', () => 
  {
    it("should stay the same string with no additional objects", () => 
    {
      const unchangedString = "This doesnt have any linkifiable items";
      const processedString: ProcessedString[] = 
      [
        {
          type: "text",
          value: "This doesnt have any linkifiable items"
        }
      ] 
      expect(service.linkifyProse(unchangedString)).toStrictEqual<ProcessedString[]>(processedString);
    })

    it("should be correct type image", () => 
    {
      const typeString = "test [fire](https://poketeams.com/images/types/fire.png){type} test"
      const processedType: ProcessedString[] = 
      [
        { 
          type: "text",
          value: "test "
        },
        {
          type: "img",
          path: "https://poketeams.com/images/types/fire.png",
          value: "fire"
        },
        { 
          type: "text",
          value: " test"
        },
      ]
      expect(service.linkifyProse(typeString)).toStrictEqual<ProcessedString[]>(processedType);
    })

    it("should be correct abilty", () => 
    {
      const abilityString = "test [water-absorb](https://bulbapedia.bulbagarden.net/wiki/Water_Absorb_(Ability)){ability} test"
      const processedType: ProcessedString[] = 
      [
        { 
          type: "text",
          value: "test "
        },
        {
          type: "link",
          path: "https://bulbapedia.bulbagarden.net/wiki/Water_Absorb_",
          value: "water-absorb"
        },
        { 
          type: "text",
          value: " test"
        },
      ]
      expect(service.linkifyProse(abilityString)).toStrictEqual<ProcessedString[]>(processedType);
    })

    it("should be correct move", () => 
    {
      const moveString = "test [substitute](https://bulbapedia.bulbagarden.net/wiki/Substitute_(move)){move} test"
      const processedType: ProcessedString[] = 
      [
        { 
          type: "text",
          value: "test "
        },
        {
          type: "link",
          path: "https://bulbapedia.bulbagarden.net/wiki/Substitute_",
          value: "substitute"
        },
        { 
          type: "text",
          value: " test"
        },
      ]
      expect(service.linkifyProse(moveString)).toStrictEqual<ProcessedString[]>(processedType);
    })

    it("should be correct mechanics", () => 
    {
      const mechanicString = "Causes the target to [flinch](https://bulbapedia.bulbagarden.net/wiki/Flinch_(status_condition)){mechanic}. Can only be used on the user's first turn after entering the [field](https://bulbapedia.bulbagarden.net/wiki/Field_(status_condition)){mechanic}"
      const processedType: ProcessedString[] = 
      [
        { 
          type: "text",
          value: "Causes the target to "
        },
        {
          type: "link",
          path: "https://bulbapedia.bulbagarden.net/wiki/Flinch_",
          value: "flinch"
        },
        { 
          type: "text",
          value: ". Can only be used on the user's first turn after entering the "
        },
        {
          type: "link",
          path: "https://bulbapedia.bulbagarden.net/wiki/Field_",
          value: "field"
        },
        { 
          type: "text",
          value: ""
        },
      ]
      expect(service.linkifyProse(mechanicString)).toStrictEqual<ProcessedString[]>(processedType);
    })
  })
});
