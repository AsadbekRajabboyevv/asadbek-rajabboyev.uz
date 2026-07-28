import LanguagePage from './[lang]/page';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  return <LanguagePage params={Promise.resolve({ lang: 'en' })} />;
}
