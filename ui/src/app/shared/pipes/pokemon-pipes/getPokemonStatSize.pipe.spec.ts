import { TeamOptions } from "../../../core/models/team/teamOptions.model";
import { GetPokemonStatSizePipe } from "./getPokemonStatSize.pipe";

describe('GetPokemonStatSizePipe', () =>
{
  let pipe: GetPokemonStatSizePipe;

  beforeEach(() => 
  {
    pipe = new GetPokemonStatSizePipe();
  });

  describe('', () =>
  {

  })

  it('should return 0 when value is undefined', () => 
  {
    const teamOptions: TeamOptions = 
    {
      evsVisibility: false,
      ivsVisibility: false,
      naturesVisibility: false,
      maxStat: 1,
      showNickname: false,
    }
    
    expect(pipe.transform(undefined, teamOptions)).toBe("0");
  })

  it('should return 0 when team options is undefined', () => 
  {
    expect(pipe.transform(2, undefined)).toBe("0");
  })

  it('should return 0 when both value and team options are undefined', () => 
  {
    expect(pipe.transform(undefined, undefined)).toBe("0");
  })

  it('should calculate percentage based on custom maxStat', () => 
  {
    const teamOptions: TeamOptions = 
    {
      evsVisibility: false,
      ivsVisibility: false,
      naturesVisibility: false,
      maxStat: 200,
      showNickname: false,
    }

    expect(pipe.transform(100, teamOptions)).toBe('50%');
  });

  it('should calculate percentage based on default maxStat (700)', () => 
  {
    const teamOptions: TeamOptions = 
    {
      evsVisibility: false,
      ivsVisibility: false,
      naturesVisibility: false,
      maxStat: 0,
      showNickname: false,
    }
    
    expect(pipe.transform(350, teamOptions)).toBe('50%');
  });

  it('should handle values greater than maxStat', () => 
  {
    const teamOptions: TeamOptions = 
    {
      evsVisibility: false,
      ivsVisibility: false,
      naturesVisibility: false,
      maxStat: 100,
      showNickname: false,
    }

    expect(pipe.transform(200, teamOptions)).toBe('200%');
  });
});