import {useCanvasTexture} from '../../graphics'
import {drawCvPreview} from './drawCvPreview'
import {CV_PREVIEW_HEIGHT, CV_WIDTH} from './preview'

export const useCvPreview = () =>
  useCanvasTexture('cv-preview', {height: CV_PREVIEW_HEIGHT, width: CV_WIDTH}, drawCvPreview, 2)
