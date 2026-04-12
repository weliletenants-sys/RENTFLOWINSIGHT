import { Request, Response } from 'express';
import { RoiService } from './roi.service';

export class RoiController {
  private service = new RoiService();

  /**
   * Endpoint: POST /roi/run-cycle
   */
  public runCycle = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.runRoiCycle();
      
      res.status(200).json({
        message: 'ROI cycle executed via Ledger.',
        data: result
      });
    } catch (error: any) {
      console.error('Error running ROI cycle:', error);
      res.status(500).json({ error: 'Internal Server Error executing ROI batch.' });
    }
  };
}

export const roiController = new RoiController();
