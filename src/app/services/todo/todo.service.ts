import { BaseService } from "../base/base.service";
import { injectable } from "tsyringe";
import TodoModel, { TODO } from "../../models/todo.models";

@injectable()
export default class TodoService extends BaseService<TODO> {
    constructor() {
        super(TodoModel);
    }
}