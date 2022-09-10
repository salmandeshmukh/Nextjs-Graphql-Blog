import Link from "next/link"
import Image from 'next/image';
import { getDate } from "../utils";

export default function Home({posts}) {
  return (
    <>
      <div className="container mt-5">
        <h1 className="text-center my-5">NextJS Blog</h1>
        <h3 className="my-3">Wordpress Blog Posts</h3>
        <hr />
        <div className="row">
          {posts.nodes.map(post => {
            return (
              <div className="col-md-4 mb-3" key={post.slug}>
                <div className="card">                  
                  <Image width="640" height="426" className="img-cover card-img-top" src={post.featuredImage.node.sourceUrl} />
                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <div className="card-text" dangerouslySetInnerHTML={{ __html: post.excerpt}}></div>
                    <p className="card-text"><small className="text-muted">On {getDate(post.date)}</small></p>
                    <Link href={`/posts/${post.slug}`}><a className="btn btn-primary">See more</a></Link>
                  </div>
                </div>
              </div>
            )
          })
          }
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  const res = await fetch('http://salman.reliable-consultants.com/headless/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
      query HomePageQuery {
        posts (first : 100) {
          nodes {
            featuredImage {
              node {
                sourceUrl
              }
            }
            slug
            title
            date
            content
            excerpt
          }
        }
      }
      `,
    })
  })

  const json = await res.json()

  return {
    props: {
      posts: json.data.posts,
    },
    revalidate: 1,
  }
}