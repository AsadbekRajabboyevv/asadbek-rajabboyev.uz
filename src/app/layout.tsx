import type { Metadata } from 'next';
import './globals.css';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Asadbek Rajabboyev | Ultra-Premium Portfolio',
  description: 'Java Backend Developer specializing in Spring Boot, REST APIs, and High-Performance Systems.',
};

function getThemeData() {
  try {
    // Direct database connection to avoid import issues
    const dataDir = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const db = new Database(path.join(dataDir, 'portfolio.db'), { readonly: true });
    
    const settings = db.prepare('SELECT theme FROM settings WHERE id = 1').get();
    let activeThemeCode = settings?.theme || 'cyber_dark';
    
    // Validate that the theme exists in the database
    const themeExists = db.prepare('SELECT code FROM themes WHERE code = ?').get(activeThemeCode);
    if (!themeExists) {
      activeThemeCode = 'cyber_dark';
    }
    
    const allThemes = db.prepare('SELECT * FROM themes').all();
    
    db.close();
    
    // Build dynamic CSS string for custom or database themes
    let customCss = '';
    allThemes.forEach((t: any) => {
      customCss += `
        html[data-theme="${t.code}"] {
          --background: ${t.bg_color} !important;
          --foreground: ${t.fg_color} !important;
          --accent: ${t.accent_color} !important;
          --glass-bg: ${t.glass_bg} !important;
          --glass-border: ${t.glass_border} !important;
        }
      `;
    });

    return { activeThemeCode, customCss };
  } catch (error) {
    return { activeThemeCode: 'cyber_dark', customCss: '' };
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { activeThemeCode, customCss } = getThemeData();

  return (
    <html lang="en" data-theme={activeThemeCode} className="dark scroll-smooth">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" />
        <style dangerouslySetInnerHTML={{ __html: customCss }} />
      </head>
      <body className="text-slate-100 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}