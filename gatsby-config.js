require(`dotenv`).config()

const shouldAnalyseBundle = process.env.ANALYSE_BUNDLE

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    siteTitle: `Kay's Blog`,
    siteTitleAlt: `👋 kay's Blog`,
    siteHeadline: `👋 kay's Blog`,
    siteUrl: `https://minimal-blog.lekoarts.de`,  // Todo 배포후 URL 수정해야 함
    siteImage: `/banner.jpg`,
    siteLanguage: `ko`,
    siteDescription: `소프트웨어 개발자 고영욱의 성장(成長) 블로그`,
    author: `@Kay_ `,
  },
  plugins: [
    {
      resolve: `@lekoarts/gatsby-theme-minimal-blog`,
      options: {
        blogPath: `/posts`,
        navigation: [
          {
            title: `About`,
            slug: `/about`,
          },
          {
            title: `Posts`,
            slug: `/posts`,
          },
          {
            title: `Tags`,
            slug: `/tags`,
          }
        ],
        externalLinks: [
          {
            name: `Twitter`,
            url: `https://twitter.com/KoYoungwock`,
          },
          {
            name: `LinkedIn`,
            url: `https://www.linkedin.com/in/youngwock-ko-74223921b/`,
          },
        ],
        feeds: true,
        feedTitle: `Kay's Blog`,
        formatString: "YYYY.MM.DD",
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Kay's Blog`,
        short_name: `Kay's Blog`,
        description: `소프트웨어 개발자 고영욱의 성장(成長) 블로그`,
        start_url: `/`,
        background_color: `#fff`,
        display: `standalone`,
        icons: [
          {
            src: `/android-chrome-192x192.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
          {
            src: `/android-chrome-512x512.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
        ],
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-netlify`,
    shouldAnalyseBundle && {
      resolve: `gatsby-plugin-webpack-bundle-analyser-v2`,
      options: {
        analyzerMode: `static`,
        reportFilename: `_bundle.html`,
        openAnalyzer: false,
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title: siteTitle
                description: siteDescription
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allPost } }) =>
              allPost.nodes.map((post) => {
                const url = site.siteMetadata.siteUrl + post.slug
                const content = `<p>${post.excerpt}</p><div style="margin-top: 50px]; font-style: italic;"><strong><a href="${url}">더 읽어보기</a>.</strong></div><br /> <br />`

                return {
                  title: post.title,
                  date: post.date,
                  excerpt: post.excerpt,
                  url,
                  guid: url,
                  custom_elements: [{ "content:encoded": content }],
                }
              }),
            query: `
              {
                allPost(sort: { fields: date, order: DESC }) {
                  nodes {
                    title
                    date(formatString: "MMMM D, YYYY")
                    excerpt
                    slug
                  }
                }
              }
            `,
            output: `rss.xml`,
            title: `Kay's Blog`
          },
        ],
      },
    },
  ].filter(Boolean),
}
