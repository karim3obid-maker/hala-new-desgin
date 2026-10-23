import {Link} from 'react-router';
import {Icon} from '../ui/Icon';
import {readingMinutes} from '../../data/blogPosts';
export default function BlogCard({post}){return <article className="hala-blog-card"><Link to={'/blog/'+post.slug} className="blog-card-image" tabIndex={-1} aria-hidden="true"><img src={post.image} alt="" loading="lazy"/></Link><div className="blog-card-content"><span className="blog-category">{post.category}</span><h3><Link to={'/blog/'+post.slug}>{post.title}</Link></h3><p>{post.excerpt}</p><div className="blog-card-bottom"><span>{readingMinutes(post)} دقائق قراءة</span><Link to={'/blog/'+post.slug} aria-label={'اقرأ: '+post.title}>اقرأ المقال <Icon name="chevron-left"/></Link></div></div></article>}
