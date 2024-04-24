import 'dotenv/config';

process.env.IS_TEST = '1'; // Don't change this, otherwise the production DB might be affected!
process.env.TEST_START_TIMESTAMP = new Date().toISOString().replace(/:/g, '_').replace(/\./g, '_');
process.env.SLACK_ERROR_CHANNEL = '';

export default async () => {
  return; // Do nothing
};
