export interface ProcessedString
{
  type: "text" | "img" | "link",
  path?: string,
  value: string
}