import { buildFileTree, getAllPosts } from '@/lib/utils/content';
import { BlogContent } from '@/components/blog-content';

export default async function BlogPage() {
  const fileTree = buildFileTree(process.cwd() + '/content');
  const posts = await getAllPosts();
  
  return (
    <div>
      <BlogContent fileTree={fileTree} initialPosts={posts} />
    </div>
  );
}