import { baseUrl } from 'lib/config/client';
import { listActivePages } from 'lib/services/directus/static';
import { Page } from '@/lib/models';

function generateSiteMap(pages: Page[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>${baseUrl}/</loc>
     </url>
     <url>
       <loc>${baseUrl}/privacy</loc>
     </url>
     <url>
       <loc>${baseUrl}/terms</loc>
     </url>
     ${pages
       .map((page) => {
         return `
       <url>
           <loc>${`${baseUrl}/${page.slug}`}</loc>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // We make an API call to gather the URLs for our site
  const pages = await listActivePages();

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(pages);

  res.setHeader('Content-Type', 'text/xml');
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {}
  };
}

export default SiteMap;
