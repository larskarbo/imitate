require("dotenv").config({
  path: `.env`,
})

module.exports = {
  siteMetadata: {
    title: `Imitate`,
    siteUrl: `https://goimitate.com`,
  },
  plugins: [
    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     name: `content`,
    //     path: `${__dirname}/src/content`, <- gave error on netlify, check fileparty
    //   },
    // },
    {
      resolve: "@sentry/gatsby",
      options: {
        dsn: "https://b0ae189020a5488d88c18ec67d678c7d@o524534.ingest.sentry.io/5647182",
        sampleRate: 0.7,
      },
    },
    'gatsby-plugin-postcss',
    `gatsby-plugin-netlify`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              // Options here
              maxWidth: 630,
            }
          },
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-image`,
    // `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Imitate`,
        short_name: `Imitate`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/pages/logo.svg`,
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        exclude: [`/admin`],
      }
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://goimitate.com`,
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          "G-RTPJWENTLM", // Google Analytics / GA
        ],
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
