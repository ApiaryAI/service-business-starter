import clientData from '../content/clients.json';
import { site } from './site';
import { on } from './sections';

export interface Client {
  name: string;
  example: boolean;
  logo?: { src: string; width: number; height: number; dark?: boolean };
}

/** Customer relationships and logo permissions must be confirmed before publication. */
export const clients: Client[] = (on('clients') ? clientData as Client[] : []).filter(client => !client.example || !site.readyForLaunch);
