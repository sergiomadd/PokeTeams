export interface Item
{
  identifier: string,
  name: string,
  prose: string,
  iconPath: string
}

export const DefaultItem: Item =
{
  identifier: "error",
  name: "Not Found",
  prose: "",
  iconPath: "assets/error.png"
}