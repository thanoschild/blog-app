import { formatDate } from '@/lib/utils';
import { PLAYLIST_BY_SLUG_QUERY, STARTUP_BY_ID_QUERY } from '@/sanity/lib/queries';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import markdownit from "markdown-it";
import React, { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton';
import View from '@/components/View';
import { client } from '@/sanity/lib/client';
import StartupCard, { StartupCardType } from '@/components/StartupCard';

const md = markdownit();

const StartupPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;
    
    const [post, playlistData] = await Promise.all([
        client.fetch(STARTUP_BY_ID_QUERY, { id }),
        client.fetch(PLAYLIST_BY_SLUG_QUERY, {
          slug: "editor-picks-new",
        }),
    ]);

    if (!post) return notFound();

    const editorPosts = playlistData?.select || [];
    const parsedContent = md.render(post?.pitch || "");

    return (
        <>
            <section className="pink_container !min-h-[230px]">
                <p className="tag">{formatDate(post?._createdAt)}</p>

                <h1 className="heading">{post.title}</h1>
                <p className="sub-heading !max-w-5xl">{post.description}</p>
            </section>

            <section className="section_container">
                <Image
                    src={post.image}
                    width={800}
                    height={600}
                    quality={90}
                    alt="thumbnail"
                    className="w-[300px] md:w-[600px] lg:w-[800px] h-[100px] md:h-[300px] lg:h-[600px] rounded-xl mx-auto"
                    priority
                />

                <div className="space-y-5 mt-10 max-w-4xl mx-auto">
                    <div className="flex-between gap-5">
                        <Link
                            href={`/user/${post.author?._id}`}
                            className="flex gap-2 items-center mb-3"
                        >
                            <Image
                                src={post.author.image}
                                alt="avatar"
                                width={64}
                                height={64}
                                className="rounded-full bg-black drop-shadow-lg object-contain w-[64px] h-[64px]"
                            />

                            <div>
                                <p className="text-20-medium">{post.author.name}</p>
                                <p className="text-16-medium !text-black-300">
                                    @{post.author.username}
                                </p>
                            </div>
                        </Link>

                        <p className="category-tag">{post.category}</p>
                    </div>


                    <h3 className="text-30-bold">Pitch Details</h3>
                    {parsedContent ? (
                        <article
                            className="prose max-w-4xl font-work-sans break-all"
                            dangerouslySetInnerHTML={{ __html: parsedContent }}
                        />
                    ) : (
                        <p className="no-result">No details provided</p>
                    )}
                </div>
                <hr className="divider" />

                {editorPosts.length > 0 && (
                    <div className="max-w-4xl mx-auto">
                        <p className="text-30-semibold">Editor Picks</p>
                        <ul className="mt-7 card_grid-sm">
                            {editorPosts.map((post: StartupCardType, i: number) => (
                                <StartupCard key={i} post={post} />
                            ))}
                        </ul>
                    </div>
                )}

                <Suspense fallback={<Skeleton className="view_skeleton" />}>
                    <View id={id} />
                </Suspense>
            </section>
        </>
    )
}

export default StartupPage;