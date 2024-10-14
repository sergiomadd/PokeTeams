export interface Type
{
  identifier: string,
  name: string,
  iconPath: string
}

export const defaultType: Type = 
{
  identifier: "error",
  name: "Not Found",
  iconPath: "assets/error.png"
}