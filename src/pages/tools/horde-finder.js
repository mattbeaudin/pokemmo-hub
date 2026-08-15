import { graphql } from 'gatsby'
import React from 'react'
import { Page } from '../../components/Page'
import { PageTitle } from '../../components/PageTitle'
import { Seo } from '../../components/SEO'
import { HordeFinder } from '../../components/HordeFinder/HordeFinder'

const HordeFinderPage = ({ data, pageContext }) => {
    const PAGE_TITLE = "Horde Finder"
    const sprites = data.allFile.edges
    return (
        <Page breadcrumbs={pageContext.breadcrumb} label={PAGE_TITLE}>
            <PageTitle credits="Find Pokemon obtainable through horde encounters, grouped by shiny tier." className='mb-1 mt-2'>{PAGE_TITLE}</PageTitle>
            <HordeFinder sprites={sprites} />
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
            gatsbyImageData(width: 64, placeholder: DOMINANT_COLOR, formats: [AUTO, WEBP])
          }
        }
      }
    }
  }
`

const description = "Find every Pokemon obtainable via horde encounters in PokeMMO, grouped by shiny tier, with location, chance, season and time-of-day details."
export const Head = () => <Seo title="Horde Finder" description={description}></Seo>

export default HordeFinderPage
