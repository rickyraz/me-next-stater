import { allPosts } from "contentlayer/generated";
import { format, parseISO } from "date-fns";
import { notFound } from "next/navigation";
import { useMDXComponent } from "next-contentlayer/hooks";

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }));

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);

  if (!post) throw new Error(`Post not found for slug: ${params.slug}`);
  return { title: post.title };
};

export default async function Page({ params }: { params: { slug: string } }) {
  // Find the post for the current page.
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);

  // 404 if the post does not exist.
  if (!post) notFound();

  // Parse the MDX file via the useMDXComponent hook.
  // - If you're using MDX in your Next.js project, useMDXComponent makes it easy to render MDX in your layouts.
  // https://www.contentlayer.dev/docs/reference/next-contentlayer-e6e7eb3a#usemdxcomponent
  // const MDXContent = useMDXComponent(post.body.code);

  return (
    <div>
      <article className="mx-auto max-w-xl py-8">
        <div className="mb-8 text-center">
          <time dateTime={post.date} className="mb-1 text-xs text-gray-600">
            {format(parseISO(post.date), "LLLL d, yyyy")}
          </time>
          <h1 className="text-3xl font-bold">{post.title}</h1>
        </div>
        <div className="[&>*]:mb-3 [&>*:last-child]:mb-0" />
      </article>
    </div>
  );
}
