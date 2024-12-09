"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassController = void 0;
const ClassServices_1 = require("../services/ClassServices");
class ClassController {
    constructor() {
        this.classService = new ClassServices_1.ClassService();
    }
    async getAllClasses(req, res) {
        try {
            const classes = await this.classService.getAllClass();
            res.json(classes);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching classes', error });
        }
    }
    async getClassById(req, res) {
        try {
            const classData = await this.classService.getClassById(Number(req.params.id));
            if (!classData) {
                return res.status(404).json({ message: 'Class not found' });
            }
            res.json(classData);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching class', error });
        }
    }
    // async createClass(req: Request, res: Response) {
    //   try {
    //     const classDTO: ClassDTO = req.body;
    //     const newClass = await this.classService.createClass(classDTO);
    //     res.status(201).json(newClass);
    //   } catch (error) {
    //     res.status(400).json({ message: 'Error creating class', error });
    //   }
    // }
    async updateClass(req, res) {
        try {
            const classDTO = req.body;
            const classId = Number(req.params.id);
            const classExists = await this.classService.getClassById(classId);
            if (!classExists) {
                return res.status(404).json({ message: 'Class not found' });
            }
            await this.classService.updateClass(classId, classDTO);
            res.sendStatus(204);
        }
        catch (error) {
            res.status(400).json({ message: 'Error updating class', error });
        }
    }
    async deleteClass(req, res) {
        try {
            const classId = Number(req.params.id);
            const classExists = await this.classService.getClassById(classId);
            if (!classExists) {
                return res.status(404).json({ message: 'Class not found' });
            }
            await this.classService.deleteClass(classId);
            res.sendStatus(204);
        }
        catch (error) {
            res.status(500).json({ message: 'Error deleting class', error });
        }
    }
}
exports.ClassController = ClassController;
exports.default = ClassController;
//# sourceMappingURL=ClassController.js.map