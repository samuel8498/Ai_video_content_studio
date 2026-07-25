import { Request, Response } from 'express';

// In-memory fallback database store if Supabase credentials are not connected
const projectMemoryDb: any[] = [];

export class ProjectController {
  static async getProjects(req: Request, res: Response) {
    try {
      return res.status(200).json({ success: true, projects: projectMemoryDb });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async createProject(req: Request, res: Response) {
    try {
      const projectData = req.body;
      const newProject = {
        id: `proj_${Date.now()}`,
        ...projectData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      projectMemoryDb.unshift(newProject);
      return res.status(201).json({ success: true, project: newProject });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async updateProject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const index = projectMemoryDb.findIndex(p => p.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Project not found' });
      }
      projectMemoryDb[index] = {
        ...projectMemoryDb[index],
        ...req.body,
        updated_at: new Date().toISOString()
      };
      return res.status(200).json({ success: true, project: projectMemoryDb[index] });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async deleteProject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const index = projectMemoryDb.findIndex(p => p.id === id);
      if (index !== -1) {
        projectMemoryDb.splice(index, 1);
      }
      return res.status(200).json({ success: true, message: 'Project deleted' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
