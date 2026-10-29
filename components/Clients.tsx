import { clients } from '../lib/clients';
import { ClientsCarousel } from './ClientsCarousel';

export function Clients() {
  if (!clients.length) return null;
  const onlyExamples = clients.every(client => client.example);
  return <section className="section section--tint hk-clients-sec" aria-labelledby="starter-clients-title">
    <div className="container">
      <p className="eyebrow">{onlyExamples ? 'Client card examples' : 'Our clients'}</p>
      <h2 id="starter-clients-title">{onlyExamples ? 'A place for your client names and logos' : 'Some of the people we work with'}</h2>
      <p className="hk-muted">{onlyExamples ? 'These demonstration cards show how your confirmed client relationships can appear.' : 'A selection of the businesses and organisations we work with.'}</p>
      <ClientsCarousel clients={clients} label={onlyExamples ? 'Example client cards' : 'Our clients'} />
    </div>
  </section>;
}
