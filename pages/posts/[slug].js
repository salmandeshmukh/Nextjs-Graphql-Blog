import React from 'react'
import Link from "next/link"
import Image from 'next/image';
import { getDate } from "../../utils";

export default function Post(data) {
    const post = data.post;
    
    return (
        <>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-6">
                        <Image width="640" height="426" className='img-cover' src={post.featuredImage.node.sourceUrl} />
                    </div>
                    <div className="col-md-6">
                        <h1>{post.title}</h1>
                        <hr />
                        <p className="card-text"><small className="text-muted">On {getDate(post.date)}</small></p>
                        <div className="card-text pb-5" dangerouslySetInnerHTML={{ __html: post.content }}></div>
                        <Link href="/"><a className="btn btn-primary mb-3">Back to home</a></Link>
                    </div>
                </div>
            </div>
        </>

    )

}


export async function getStaticProps(context) {

    const res = await fetch('http://salman.reliable-consultants.com/headless/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
                query SinglePost($id: ID!, $idType: PostIdType!) {
                    post(id: $id, idType: $idType) {
                        title
                        date
                        slug
                        content
                        featuredImage {
                            node {
                                sourceUrl
                            }
                        }
                    }
                }
            `,
            variables: {
                id: context.params.slug,
                idType: 'SLUG'
            }
        })
    })

    const json = await res.json()

    return {
        props: {
            post: json.data.post,
        },
        revalidate: 1,
    }

}

export async function getStaticPaths() {

    const res = await fetch('http://salman.reliable-consultants.com/headless/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
            query AllPostsQuery {
                posts {
                    nodes {
                        slug
                        content
                        title
                        featuredImage {
                            node {
                                sourceUrl
                            }
                        }
                    }
                }
            }
        `})
    })

    const json = await res.json()
    const posts = json.data.posts.nodes;

    const paths = posts.map((post) => ({
        params: { slug: post.slug },
    }))

    return { paths, fallback: false }

}
