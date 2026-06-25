export interface ValidateChildSessionInputDTO {
  sessionToken: string;
}

export interface ValidateChildSessionOutputDTO {
  childId: string;
  parentId: string;
  sessionId: string;
}