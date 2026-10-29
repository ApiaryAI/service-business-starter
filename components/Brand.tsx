import Link from 'next/link';
import { company } from '../lib/content';
export function Brand({ size = 'md' }: { size?: 'md' | 'lg' }) {
 return <Link href="/" className={`hk-brand hk-brand--${size} starter-brand`} aria-label={`${company.name}, home`}><span className="starter-mark" aria-hidden="true">/</span><span>{company.name}</span></Link>;
}
