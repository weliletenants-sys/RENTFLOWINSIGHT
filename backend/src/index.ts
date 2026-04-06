import app from './app';
import { funderWorker } from './workers/funder.worker';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Background worker [${funderWorker.name}] initialized.`);
});
