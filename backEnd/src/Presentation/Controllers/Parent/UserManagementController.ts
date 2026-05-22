import { Request, Response, NextFunction } from "express";

export class ParentUserMangementController {
    constructor (
        private _getAllChildrenUseCase: IParent
    )
}