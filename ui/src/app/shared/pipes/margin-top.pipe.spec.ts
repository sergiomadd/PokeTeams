import { ComparePokemon } from '../../features/compare-page/compare-page.component';
import { MarginTopPipe } from './margin-top.pipe';

describe('MarginTopPipe', () => {
  let pipe: MarginTopPipe;

  beforeEach(() => {
    pipe = new MarginTopPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return "0" when statList is undefined', () => {
    const comparePokemon: ComparePokemon = {
      whichTeam: 'A',
      sourceIndex: 0,
      stats: { total: [{ value: 100 }] } as any
    };

    expect(pipe.transform(undefined, comparePokemon, 0, 0)).toBe('0');
  });

  it('should return "0" for first element (i = 0)', () => {
    const statList: ComparePokemon[] = [
      { 
        whichTeam: 'A', 
        sourceIndex: 0,
        stats: { total: [{ value: 100 }] } as any 
      }
    ];

    expect(pipe.transform(statList, statList[0], 0, 0)).toBe('0');
  });

  it('should return "-2.9em" when prev is different team with same value', () => {
    const statList: ComparePokemon[] = [
      { 
        whichTeam: 'A', 
        sourceIndex: 0,
        stats: { total: [{ value: 100 }] } as any 
      },
      { 
        whichTeam: 'B', 
        sourceIndex: 1,
        stats: { total: [{ value: 100 }] } as any 
      }
    ];

    expect(pipe.transform(statList, statList[1], 0, 1)).toBe('-2.9em');
  });

  it('should return "0" when next is different team with same value', () => {
    const statList: ComparePokemon[] = [
      { 
        whichTeam: 'A', 
        sourceIndex: 0,
        stats: { total: [{ value: 80 }] } as any 
      },
      { 
        whichTeam: 'A', 
        sourceIndex: 1,
        stats: { total: [{ value: 100 }] } as any 
      },
      { 
        whichTeam: 'B', 
        sourceIndex: 2,
        stats: { total: [{ value: 100 }] } as any 
      }
    ];

    expect(pipe.transform(statList, statList[1], 0, 1)).toBe('0');
  });

  it('should return "0" when prev is different team, prevprev is same team with same value', () => {
    const statList: ComparePokemon[] = [
      { 
        whichTeam: 'A', 
        sourceIndex: 0,
        stats: { total: [{ value: 100 }] } as any 
      },
      { 
        whichTeam: 'B', 
        sourceIndex: 1,
        stats: { total: [{ value: 100 }] } as any 
      },
      { 
        whichTeam: 'A', 
        sourceIndex: 2,
        stats: { total: [{ value: 150 }] } as any 
      }
    ];

    expect(pipe.transform(statList, statList[2], 0, 2)).toBe('0');
  });

  it('should return "-1em" when prev is different team with different value', () => {
    const statList: ComparePokemon[] = [
      { 
        whichTeam: 'A', 
        sourceIndex: 0,
        stats: { total: [{ value: 100 }] } as any 
      },
      { 
        whichTeam: 'B', 
        sourceIndex: 1,
        stats: { total: [{ value: 150 }] } as any 
      }
    ];

    expect(pipe.transform(statList, statList[1], 0, 1)).toBe('-1em');
  });

  it('should return "0" when prev is same team', () => {
    const statList: ComparePokemon[] = [
      { 
        whichTeam: 'A', 
        sourceIndex: 0,
        stats: { total: [{ value: 100 }] } as any 
      },
      { 
        whichTeam: 'A', 
        sourceIndex: 1,
        stats: { total: [{ value: 150 }] } as any 
      }
    ];

    expect(pipe.transform(statList, statList[1], 0, 1)).toBe('0');
  });

  it('should handle different selectedStatIndex', () => {
    const statList: ComparePokemon[] = [
      { 
        whichTeam: 'A', 
        sourceIndex: 0,
        stats: { total: [{ value: 50 }, { value: 200 }] } as any 
      },
      { 
        whichTeam: 'B', 
        sourceIndex: 1,
        stats: { total: [{ value: 100 }, { value: 200 }] } as any 
      }
    ];

    expect(pipe.transform(statList, statList[1], 0, 1)).toBe('-1em');
    expect(pipe.transform(statList, statList[1], 1, 1)).toBe('-2.9em');
  });
});