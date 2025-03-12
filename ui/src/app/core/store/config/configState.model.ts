export interface ConfigState
{
  theme: string,
  lang: string,
  teamsPerPage: number
}

export const initialConfigState: ConfigState = 
{
  theme: "light",
  lang: "en",
  teamsPerPage: 20
};
