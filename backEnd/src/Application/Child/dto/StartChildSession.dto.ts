export interface StartChildSessionInputDTO {
  childId: string;
  parentId: string;
}

export interface StartChildSessionOutputDTO {
  sessionId: string;
  sessionToken: string;
}