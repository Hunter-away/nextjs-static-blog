import { buildFileTree } from '@/lib/utils/content';
import { BlogContent } from '@/components/blog-content';

export default async function BlogPage() {
  const fileTree = buildFileTree(process.cwd() + '/content');
  
  return (
    <div className="container mt-20">
      <BlogContent fileTree={fileTree} />
    </div>
  );
}