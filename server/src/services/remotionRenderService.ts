import { RenderVideoService } from './renderVideo';

export class RemotionRenderService {
  static async renderProject(project: any) {
    return RenderVideoService.renderVideo(project);
  }
}
