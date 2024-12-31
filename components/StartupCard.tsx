import { cn, formatDate } from '@/lib/utils'
import { EyeIcon } from 'lucide-react'
import Image from 'next/image';
import React from 'react'
import { Button } from './ui/button';
import Link from 'next/link';
import { Author, Startup } from '@/sanity/types';
import { Skeleton } from './ui/skeleton';

export type StartupCardType = Omit<Startup, 'author'> & {author?: Author}

const StartupCard = ({post}: {post: StartupCardType}) => {
    const {_createdAt, views, author, _id, description, image, category, title} = post;
    const authorId = author?._id;
    const authorName = author?.name;
  return (
    <li className="startup-card group">
      <div className="flex-between">
        <p className="startup_card_date">{formatDate(new Date(_createdAt))}</p>
        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{views}</span>
        </div>
      </div>

      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/user/${authorId}`}>
            <p className="text-16-medium line-clamp-1">{authorName}</p>
          </Link>
          <Link href={`/startup/${_id}`}>
            <h3 className="text-26-semibold line-clamp-1">{title}</h3>
          </Link>
        </div>
        <Link href={`/user/${authorId}`}>
          <Image
            src={image!}
            alt={authorName!}
            width={48}
            height={48}
            className="rounded-full object-cover w-[48px] h-[48px]"
          />
        </Link>
      </div>

      <Link href={`/startup/${_id}`}>
        <p className="startup-card_desc">{description}</p>
        <Image 
          src={image!} 
          width={300} 
          height={300} 
          alt="placeholder" 
          className="startup-card_img" 
        />
      </Link>

      <div className="flex-between gap-3 mt-5">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-16-medium">{category}</p>
        </Link>
        <Button className="startup-card_btn" asChild>
          <Link href={`/startup/${_id}`}>Details</Link>
        </Button>
      </div>
    </li>
  )
}

export const StartupCardSkeleton = () => (
    <>
      {[0, 1, 2, 3, 4].map((index: number) => (
        <li key={cn("skeleton", index)}>
          <Skeleton className="startup-card_skeleton" />
        </li>
      ))}
    </>
  );
  
  export default StartupCard;