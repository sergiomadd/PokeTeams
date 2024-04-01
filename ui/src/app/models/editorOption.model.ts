export interface EditorOption
{
  name: string,
  identifier: string,
  path: string
}

export const defaultEditorOption: EditorOption = 
{
  name: "Not Found",
  identifier: "error",
  path: "assets/error.png"
}