"use client";

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

const DEFAULT_PAGE_SIZE_OPTIONS = [12, 20, 40, 80];

interface AppSelectPageSizeProps {
  options?: number[];
  defaultSize?: number;
}

export function AppSelectPageSize({
  options = DEFAULT_PAGE_SIZE_OPTIONS,
  defaultSize = 12,
}: AppSelectPageSizeProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pageSize = Number(searchParams.get('size')) || defaultSize;

  const handlePageSizeChange = (newPageSize: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('size', newPageSize.toString());
    params.set('page', '1'); 
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Số mục mỗi trang:</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={"icon"} disabled={isPending}>
            {isPending ? <Spinner/> : pageSize}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            {options.map((size) => (
              <DropdownMenuItem key={size} onClick={() => handlePageSizeChange(size)}>
                {size}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
