export interface Tournament 
{
  name: string,
  city?: string,
  countryCode?: string,
  countryName?: string,
  official: boolean,
  category?: string,
  icon?: string,
  startDate?: string,
  endDate?: string
}