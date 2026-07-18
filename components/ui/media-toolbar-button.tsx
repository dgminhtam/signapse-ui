'use client';

import * as React from 'react';

import {
  AudioLinesIcon,
  FileUpIcon,
  FilmIcon,
  ImageIcon,
} from 'lucide-react';
import { isUrl, KEYS } from 'platejs';
import { useEditorRef } from 'platejs/react';

import { useLocalization } from '@/app/lib/i18n/provider';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { ToolbarButton } from './toolbar';

export function MediaToolbarButton({
  nodeType,
}: {
  nodeType: string;
}) {
  const { dictionary } = useLocalization();
  const media = dictionary.editor.media;
  const mediaConfig: Record<
    string,
    { icon: React.ReactNode; label: string; title: string }
  > = {
    [KEYS.audio]: {
      icon: <AudioLinesIcon className="size-4" />,
      label: media.audio,
      title: media.insertAudio,
    },
    [KEYS.file]: {
      icon: <FileUpIcon className="size-4" />,
      label: media.file,
      title: media.insertFile,
    },
    [KEYS.img]: {
      icon: <ImageIcon className="size-4" />,
      label: media.image,
      title: media.insertImage,
    },
    [KEYS.video]: {
      icon: <FilmIcon className="size-4" />,
      label: media.video,
      title: media.insertVideo,
    },
  };
  const currentConfig = mediaConfig[nodeType];
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <>
      <ToolbarButton
        aria-label={currentConfig.label}
        onClick={() => setDialogOpen(true)}
        tooltip={currentConfig.label}
      >
        {currentConfig.icon}
      </ToolbarButton>

      <AlertDialog
        open={dialogOpen}
        onOpenChange={(value) => {
          setDialogOpen(value);
        }}
      >
        <AlertDialogContent className="gap-6">
          <MediaUrlDialogContent
            nodeType={nodeType}
            setOpen={setDialogOpen}
            title={currentConfig.title}
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function MediaUrlDialogContent({
  nodeType,
  setOpen,
  title,
}: {
  nodeType: string;
  setOpen: (value: boolean) => void;
  title: string;
}) {
  const { dictionary } = useLocalization();
  const editor = useEditorRef();
  const [url, setUrl] = React.useState('');
  const [error, setError] = React.useState<string>();
  const inputId = React.useId();
  const errorId = `${inputId}-error`;

  const embedMedia = React.useCallback(() => {
    const value = url.trim();

    if (!isUrl(value)) {
      setError(dictionary.editor.media.invalidUrl);
      return;
    }

    setOpen(false);
    editor.tf.insertNodes({
      children: [{ text: '' }],
      name: nodeType === KEYS.file ? value.split('/').pop() : undefined,
      type: nodeType,
      url: value,
    });
  }, [dictionary.editor.media.invalidUrl, url, editor, nodeType, setOpen]);

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>
          {dictionary.editor.media.urlDescription}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <Field data-invalid={!!error}>
        <FieldLabel htmlFor={inputId}>
          {dictionary.editor.media.urlLabel}
        </FieldLabel>
        <Input
          id={inputId}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError(undefined);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              embedMedia();
            }
          }}
          placeholder={dictionary.editor.media.urlPlaceholder}
          type="url"
          autoFocus
        />
        <FieldError id={errorId}>{error}</FieldError>
      </Field>

      <AlertDialogFooter>
        <AlertDialogCancel>{dictionary.common.cancel}</AlertDialogCancel>
        <AlertDialogAction
          onClick={(e) => {
            e.preventDefault();
            embedMedia();
          }}
        >
          {dictionary.editor.insert.insert}
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
