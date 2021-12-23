import handlers from '@gambling-machine/src/mocks/handlers/handlers';
import { setupWorker } from 'msw';

export const worker = setupWorker(...handlers);
