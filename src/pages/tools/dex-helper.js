import { graphql } from 'gatsby'
import React from 'react'
import { DexHelper } from '../../components/DexHelper/DexHelper'
import { Page } from '../../components/Page'
import { PageTitle } from '../../components/PageTitle'
import { Seo } from '../../components/SEO'

const DexHelperPage = ({ data, pageContext }) => {
    const PAGE_TITLE = "Dex Helper"
    const sprites = data.allFile.edges
    return (
        <Page breadcrumbs={pageContext.breadcrumb} label={PAGE_TITLE}>
            <PageTitle
                credits="Find locations with the most uncaught Pokemon to fill your Pokedex faster."
                className="mb-1 mt-2"
            >
                {PAGE_TITLE}
            </PageTitle>
            <DexHelper sprites={sprites} />
        </Page>
    )
}

export const query = graphql`
  query {
    allFile(
      filter: {relativePath: {regex: "/sprites/"}, extension: {regex: "/(jpg)|(jpeg)|(png)/"}, childImageSharp: {gatsbyImageData: {}}}
    ) {
      edges {
        node {
          id
          name
          childImageSharp {
            gatsbyImageData(width: 100, placeholder: DOMINANT_COLOR, formats: [AUTO, WEBP])
          }
        }
      }
    }
  }
`

const description = "Find the best locations to catch uncaught Pokemon and fill your PokeMMO Pokedex faster."
export const Head = () => <Seo title="Dex Helper" description={description} />

export default DexHelperPage
